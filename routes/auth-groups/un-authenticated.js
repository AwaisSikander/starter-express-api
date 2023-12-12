const router = require("express").Router();
// const { Upload, winnerUpload } = require("../../utils/Upload");
// const { serializeUser } = require("../../controllers/auth");
const { publicRating } = require("../../controllers/auth-groups");

router.get("/events/event_by_group_url_or_ref", async (req, res, next) => {
  // return res.status(200).json({ type: "GROUPS" });
  await publicRating(req, res, next);
});

module.exports = router;
