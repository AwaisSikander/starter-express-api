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
        from: "ratings",
        localField: "_id",
        foreignField: "event_id",
        as: "ratings",
      },
    },
    {
      $project: {
        _id: 1, // Keep the object ID
        created_by: 1, // Keep specific fields
        title: 1,
        description: 1,
        ratings: {
          // Project ratings with desired fields
          _id: 1,
          given_by_user: 1,
          given_to_user: 1,
          score: 1,
        },
      },
    },
  ]);
  res.status(200).json({
    event: rating[0],
  });
};

module.exports = singleRating;
