const router = require("express").Router();
const { Upload, winnerUpload } = require("../../utils/Upload");
// const { serializeUser } = require("../../controllers/auth");
const {
  groupUsers,
  createRatingsForUsers,
  getGroupRatings,
  getGroupEventById,
  getGroupEventByDate,
} = require("../../controllers/auth-groups");

router.get("/:group_id/users", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await groupUsers(req, res, next);
});

router.get("/:group_id/events/all", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await getGroupRatings(req, res, next);
});

router.get("/:group_id/events/:event_id/ratings", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await getGroupEventById(req, res, next);
});

router.get("/:group_id/events/event_by_date", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await getGroupEventByDate(req, res, next);
});

router.post("/:group_id/event", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await createRatingsForUsers(req, res, next);
});

module.exports = router;
