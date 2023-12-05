const router = require("express").Router();
const { Upload, winnerUpload } = require("../../utils/Upload");
// const { serializeUser } = require("../../controllers/auth");
const {
  groupUsers,
  createRatingsForUsers,
} = require("../../controllers/auth-groups");

router.get("/:group_id/users", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await groupUsers(req, res, next);
});

router.post("/:group_id/ratings", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await createRatingsForUsers(req, res, next);
});

module.exports = router;
