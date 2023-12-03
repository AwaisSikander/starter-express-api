const router = require("express").Router();
const Upload = require("../../utils/Upload");
// const { serializeUser } = require("../../controllers/auth");
const {
  userProfile,
  updateUserById,
  updateUserGroup,
} = require("../../controllers/auth-users");

router.get("/", async (req, res, next) => {
  await userProfile(req, res, next);
});
router.put("/update", Upload, async (req, res, next) => {
  await updateUserById(req, res, next);
});
router.put("/groups/:group_id/update", Upload, async (req, res, next) => {
  await updateUserGroup(req, res, next);
});

module.exports = router;
