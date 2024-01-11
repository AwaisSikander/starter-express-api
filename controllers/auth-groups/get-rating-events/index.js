// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");
const Event = require("../../../models/Event");
const Rating = require("../../../models/Rating");
const { Types } = require("mongoose");
const moment = require("moment");

const singleRating = async (req, user, res, next) => {
  const { group_id, event_id } = req.params;
  const userId = req.user.id; // Get user ID from JWT

  let rating = await Event.aggregate([
    {
      $match: {
        // $and: [{ group_id }, { event_id }],
        _id: Types.ObjectId(event_id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "created_by",
        foreignField: "_id",
        as: "created_by",
        pipeline: [
          {
            $project: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              email: 1,
              phone_number: 1,
              profile_pic: 1,
              // group_ref_ids: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$created_by", // Flatten the ratings array
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
        created_by: 1,
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
        created_by: { $first: "$created_by" },
        description: { $first: "$description" },
        users: { $push: "$users" },
      },
    },
  ]);
  res.status(200).json({
    event: rating[0],
  });
};

module.exports = singleRating;
