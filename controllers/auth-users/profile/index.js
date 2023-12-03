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
      $project: {
        _id: "$group._id",
        ref_id: "$group.ref_id",
        title: "$group.title",
        url_slug: "$group.url_slug",
        status: "$group.status",
        role: 1,
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
