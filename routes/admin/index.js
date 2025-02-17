const router = require("express").Router();
const { serializeUser } = require("../../controllers/auth");

router.get("/", async (req, res) => {
  return res.status(200).json({ type: "admin", user: serializeUser(req.user) });
});

module.exports = router;
