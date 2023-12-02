const router = require("express").Router();
// const { serializeUser } = require("../../controllers/auth");
const { userProfile } = require("../../controllers/auth-users");

router.get("/", async (req, res) => {
  await userProfile(req, res);
});

module.exports = router;
