// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");

const profile = async (req, user, res, next) => {
  const { group_id } = req.params;
  const userId = req.user.id; // Get user ID from JWT

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
  const users = await UserGroup.find(query).populate("user_id");

  if (!users) {
    return res.status(404).json({ error: "No users found in this group" });
  }

  // Extract user objects from populated documents
  const userList = users.map((userGroup) => userGroup.user_id);

  res.status(200).json({ users: userList });
};

module.exports = profile;
