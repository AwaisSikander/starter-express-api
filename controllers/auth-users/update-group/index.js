// Imports
const User = require("../../../models/User");
const Group = require("../../../models/Group");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");
const { ROLE } = require("../../../config/roles");
const { getSubObject, removeEmptyProperties } = require("../../../utils");
// const {
//   winner1Upload,
//   winner2Upload,
//   winner3Upload,
// } = require("../../../utils/Upload");
const { USER_WINNER_IMAGE_PREFIX } = require("../../../config/index");
// Imports
const { updateGroupSchema, validateGroupUrlSlug } = require("../validate");

const profile = async (req, res, next) => {
  const { id } = req.user; // Get user ID from JWT
  // const updates = req.body; // User update data
  const body = removeEmptyProperties(req.body);
  const updates = await updateGroupSchema.validateAsync(body);

  const { group_id } = req.params;
  const userGroup = await UserGroup.findOne({ user_id: id, group_id });
  if (!userGroup || [ROLE.user].includes(userGroup.role)) {
    return res
      .status(404)
      .json({ error: "Group not found or you do not have admin access" });
  }

  const groupWithSlug = await validateGroupUrlSlug(updates.url_slug);
  if (groupWithSlug && updates.url_slug && groupWithSlug._id != group_id) {
    return res
      .status(404)
      .json({ error: "Group already exsists with your provided url slug" });
  }

  delete updates.ref_id;
  delete updates.role;

  const userGroupProperties = removeEmptyProperties(
    getSubObject(updates, ["title", "url_slug", "description", "about"])
  );

  const group = await Group.findByIdAndUpdate(group_id, userGroupProperties, {
    new: true,
  });

  // update GROUP

  let winner_1_image;
  if (req.files.winner_1_image && req.files.winner_1_image.length) {
    winner_1_image = req.files.winner_1_image[0].filename;
  }

  let winner_2_image;
  if (req.files.winner_2_image && req.files.winner_2_image.length) {
    winner_2_image = req.files.winner_2_image[0].filename;
  }

  let winner_3_image;
  if (req.files.winner_3_image && req.files.winner_3_image.length) {
    winner_3_image = req.files.winner_3_image[0].filename;
  }

  // const file = req.file;
  if (winner_1_image) {
    const imagePath = `${USER_WINNER_IMAGE_PREFIX}${winner_1_image}`;
    updates.winner_1_image = imagePath;
  }
  if (winner_2_image) {
    const imagePath = `${USER_WINNER_IMAGE_PREFIX}${winner_2_image}`;
    updates.winner_2_image = imagePath;
  }
  if (winner_3_image) {
    const imagePath = `${USER_WINNER_IMAGE_PREFIX}${winner_3_image}`;
    updates.winner_3_image = imagePath;
  }

  const userGroupSettingProperties = removeEmptyProperties(
    getSubObject(updates, [
      "days_to_count",
      "min_user_for_rating",
      "can_give_rating_to_admin",
      "min_users",
      "max_users",
      "winner_1_image",
      "winner_2_image",
      "winner_3_image",
    ])
  );

  const groupSetting = await GroupSetting.findOneAndUpdate(
    { group_id },
    { $set: { ...userGroupSettingProperties } }
  );

  return res.status(200).json({ group, groupSetting });
};

module.exports = profile;
