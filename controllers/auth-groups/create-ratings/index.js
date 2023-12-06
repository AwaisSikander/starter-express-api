// Imports
const User = require("../../../models/User");
const Rating = require("../../../models/Rating");
const Event = require("../../../models/Event");
const UserGroup = require("../../../models/UserGroup");
const moment = require("moment");
const GroupSetting = require("../../../models/GroupSetting");

const profile = async (req, user, res, next) => {
  /* SECURITY CHECKS  */
  // USERS MUST BELONG TO THAT GROUP
  // GROUP MUST EXSIST
  // ALLOWED ANY USER TO GIVE RATING

  const { group_id } = req.params;
  const userId = req.user.id; // Get user ID from JWT
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const users = req.body.users;
  const description = req.body.description;
  const title = req.body.title;
  const today = moment().format("YYYY-MM-DD");
  // return res.status(404).json({ error: req.body });

  const eventQuery = {
    created_by: userId,
    group_id: group_id,
    createdAt: {
      $gte: today,
      $lt: moment(today).add(1, "day").format("YYYY-MM-DD"),
    }, // Check for rating within current day (00:00 - 23:59)
  };
  const eventUpdate = {
    created_by: userId,
    group_id: group_id,
    title: title,
    description: description,
  };

  const event = await Event.findOneAndUpdate(eventQuery, eventUpdate, options);

  users.forEach(async (user) => {
    const query = {
      given_to_user: user.id,
      given_by_user: userId,
      group_id: group_id,
      event_id: event._id,
      createdAt: {
        $gte: today,
        $lt: moment(today).add(1, "day").format("YYYY-MM-DD"),
      }, // Check for rating within current day (00:00 - 23:59)
    };
    const update = {
      given_to_user: user.id,
      given_by_user: userId,
      group_id: group_id,
      event_id: event._id,
      score: user.rating,
      description: user.description,
    };
    await Rating.findOneAndUpdate(query, update, options);
  });
  // Find group settings
  res
    .status(200)
    .json({ success: true, message: "Rating created successfully for today" });
};

module.exports = profile;
