const router = require("express").Router();
const { userAuth, checkRole, serializeUser } = require("../controllers/auth");
const { ROLE } = require("../config/roles");
const passport = require("passport");

router.get("/", (req, res) => {
  res.send("Api running...");
});
// Authentication Router Middleware..
router.use("/auth", require("./auth"));

// Admin Protected Route
router.use("/admin", userAuth, checkRole([ROLE.admin]), require("./admin"));

router.use(
  "/users",
  userAuth,
  checkRole([ROLE.admin, ROLE.promoter, ROLE.user, ROLE.superadmin]),
  require("./auth-users")
);
router.use(
  "/groups",
  userAuth,
  checkRole([ROLE.admin, ROLE.promoter, ROLE.user, ROLE.superadmin]),
  require("./auth-groups")
);

// Users Protected Route
router.get("/profile", userAuth, checkRole([ROLE.user]), async (req, res) => {
  res.status(200).json({ type: ROLE.user, user: serializeUser(req.user) });
});

module.exports = router;
