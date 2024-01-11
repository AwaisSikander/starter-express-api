// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");
const Event = require("../../../models/Event");
const moment = require("moment");
const { Types } = require("mongoose");
const profile = async (req, user, res, next) => {
  const { group_id } = req.params;
  const userId = req.user.id; // Get user ID from JWT

  /* TODAY */
  const startDate = moment().startOf("D").toDate();
  const endDate = moment().endOf("D").toDate();

  let rating = await Event.aggregate([
    {
      $match: {
        $and: [
          { created_by: Types.ObjectId(userId) },
          { group_id: Types.ObjectId(group_id) },
          {
            createdAt: {
              $gte: startDate, // Filter events by start date
              $lte: endDate, // Filter events by end date
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "event_id",
        as: "ratings",
      },
    },
    {
      $unwind: "$ratings", // Flatten the ratings array
    },
    {
      $lookup: {
        from: "users",
        localField: "ratings.given_to_user",
        foreignField: "_id",
        as: "ratedUsers",
      },
    },
    {
      $unwind: "$ratedUsers", // Flatten the ratedUsers array
    },
    {
      $project: {
        title: 1,
        description: 1,
        users: {
          _id: "$ratedUsers._id",
          first_name: "$ratedUsers.first_name",
          last_name: "$ratedUsers.last_name",
          email: "$ratedUsers.email",
          phone_number: "$ratedUsers.phone_number",
          profile_pic: "$ratedUsers.profile_pic",
          score: "$ratings.score",
        },
      },
    },
    {
      $unwind: "$users", // Flatten the users array
    },
    {
      $sort: { "users.score": -1 }, // Sort users by score (descending)
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        users: { $push: "$users" },
      },
    },
  ]);

  if (rating && rating.length)
    return res.status(200).json({ event: rating[0] });

  // Find group settings
  const groupSetting = await GroupSetting.findOne({ group_id: group_id });
  let query;
  // Check if ratings for admins are allowed
  if (!groupSetting || !groupSetting.can_give_rating_to_admin) {
    query = {
      group_id: group_id,
      user_id: { $ne: userId },
      role: { $nin: ["admin", "promoter"] },
    };
  } else {
    query = {
      group_id: group_id,
      user_id: { $ne: userId },
    };
  }
  // Find users in the group, excluding the logged-in user
  const users = await UserGroup.find(query).populate({
    path: "user_id",
    select: {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      phone_number: 1,
      profile_pic: 1,
      // group_ref_ids: 1,
    },
  });

  if (!users) {
    return res.status(404).json({ error: "No users found in this group" });
  }

  // Extract user objects from populated documents
  const userList = users.map((userGroup) => userGroup.user_id);

  res.status(200).json({ event: { users: userList } });
};

module.exports = profile;
