// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");

const profile = async (userRequest, user, res, next) => {
  const userMatch = {
    user_id: user._id,
  };
  if (user.group_id) {
    userMatch.group_id = user.group_id;
  }
  let userGroups = await UserGroup.aggregate([
    {
      $match: {
        $and: [
          {
            user_id: user._id,
          },
          { default_selected: true },
        ],
      },
    },
    {
      $lookup: {
        from: "groups",
        localField: "group_id",
        foreignField: "_id",
        as: "group",
      },
    },
    {
      $unwind: "$group",
      $unwind: {
        path: "$group",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "groupsettings",
        let: {
          group_id: "$group._id",
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$group_id", "$$group_id"] },
            },
          },
          { $limit: 1 },
        ],
        as: "groupsetting",
      },
    },
    {
      $unwind: "$groupsetting",
      $unwind: {
        path: "$groupsetting",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: "$group._id",
        ref_id: "$group.ref_id",
        title: "$group.title",
        url_slug: "$group.url_slug",
        status: "$group.status",
        role: 1,
        days_to_count: "$groupsetting.days_to_count",
        min_user_for_rating: "$groupsetting.min_user_for_rating",
        can_give_rating_to_admin: "$groupsetting.can_give_rating_to_admin",
        min_users: "$groupsetting.min_users",
        max_users: "$groupsetting.max_users",
        winner_1_image: "$groupsetting.winner_1_image",
        winner_2_image: "$groupsetting.winner_2_image",
        winner_3_image: "$groupsetting.winner_3_image",
      },
    },
  ]);
  if (userGroups.length) {
    userGroups = userGroups[0];
  } else {
    userGroups = null;
  }

  let result = {
    user_id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    country: user.country,
    profile_pic: user.profile_pic,
    role: userGroups ? userGroups.role : undefined,
    user_role: user.role,
    email: user.email,
    group_ref_ids: user.group_ref_ids,
    group_id: user.group_id,
    user_group: userGroups ? userGroups : undefined,
  };

  return res.status(200).json({
    ...result,
    success: true,
  });
};

module.exports = profile;
