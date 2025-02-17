// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");
const Event = require("../../../models/Event");
const Rating = require("../../../models/Rating");
const { Types } = require("mongoose");
const moment = require("moment");
const { getGroupRefIdAndUrlSlug } = require("../validate/index");

const publicEventRating = async (req, user, res, next) => {
  const { group_id, event_id } = req.params;
  const userId = req.user.id; // Get user ID from JWT
  const { url_slug, ref_id } = req.query;

  if (!url_slug && !ref_id) {
    return res.status(400).json({ error: "Missing group identifier" });
  }

  const group = await getGroupRefIdAndUrlSlug(ref_id, url_slug);
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }

  //   const startDate = moment(req.query.startDate).startOf("D").toDate();
  //   const endDate = moment(req.query.endDate).endOf("D").toDate();

  const users = await User.aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "given_to_user",
        pipeline: [
          {
            $lookup: {
              from: "events",
              localField: "event_id",
              foreignField: "_id",
              as: "event",
              pipeline: [
                {
                  $match: {
                    // createdAt: {
                    //   $gte: startDate, // Filter events by start date
                    //   $lte: endDate, // Filter events by end date
                    // },
                    group_id: group._id, // Filter events by group ID
                  },
                },
              ],
            },
          },
          { $unwind: "$event" }, // Combine event data with each rating
          { $project: { score: 1, event: { _id: 1, title: 1 } } }, // Extract relevant data
        ],
        as: "ratings",
      },
    },
    {
      $unwind: "$ratings", // Flatten the ratings array
    },
    {
      $group: {
        _id: "$_id", // Unique user ID
        first_name: { $first: "$first_name" }, // Include username
        last_name: { $first: "$last_name" }, // Include username
        email: { $first: "$email" }, // Include user email
        phone_number: { $first: "$phone_number" }, // Include user email
        eventScores: {
          $push: {
            eventId: "$ratings.event._id",
            eventTitle: "$ratings.event.title",
            score: "$ratings.score",
          },
        }, // Array of objects with event ID, title, and score for each event
      },
    },
    {
      $sort: { _id: 1 }, // Sort by user ID
    },
  ]);
  const event_count = await Event.countDocuments({
    // createdAt: {
    //   $gte: startDate,
    //   $lte: endDate,
    // },
    group_id: group._id,
  });

  // const day = date.subtract("1", "w");
  return res.status(200).json({ users /* day, range */, event_count });
};

module.exports = publicEventRating;
