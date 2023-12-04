const router = require("express").Router();
const { Upload, winnerUpload } = require("../../utils/Upload");
// const { serializeUser } = require("../../controllers/auth");
const {
  groupUsers,
  updateUserById,
  updateUserGroup,
} = require("../../controllers/auth-groups");

router.get("/:group_id/users", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await groupUsers(req, res, next);
});
router.put("/update", Upload, async (req, res, next) => {
  await updateUserById(req, res, next);
});
router.put("/groups/:group_id/update", winnerUpload, async (req, res, next) => {
  await updateUserGroup(req, res, next);
});

module.exports = router;
