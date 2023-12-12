// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");
const Event = require("../../../models/Event");
const Rating = require("../../../models/Rating");

const groupRating = async (req, user, res, next) => {
  const { group_id } = req.params;
  const userId = req.user.id; // Get user ID from JWT
  const { page = 1, limit = 10 } = req.query;
  const filter = { isAvailable: true };
  /* IMPLEMENT GROUP CHECK */
  filter.group_id = group_id; // Filter by group ID if provided

  const events = await Event.find(filter)
    .skip((page - 1) * limit)
    .limit(+limit)
    .sort({ createdAt: -1 })
    .select({ title: 1, createdAt: 1, created_by: 1, description: 1 }); // Sort by start date and then by created date (newest first)
  // Get total number of available events for pagination
  const totalEvents = await Event.countDocuments(filter);

  // Calculate total pages
  const totalPages = Math.ceil(totalEvents / limit);

  res.status(200).json({
    events,
    pagination: {
      currentPage: page,
      totalPages,
      totalEvents,
    },
  });
};

module.exports = groupRating;
