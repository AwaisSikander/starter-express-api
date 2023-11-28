const router = require("express").Router();
const Upload = require("../../utils/Upload");
const { ROLE } = require("../../config/roles");
// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser,
} = require("../../controllers/auth");

router.get("/", async (req, res) => {
  return res.send("Auth service running...");
});

// Users Registeration Route
router.post("/signup", Upload, async (req, res) => {
  await userRegister(req.body, res, req.file);
});

// // Admin Registration Route
// router.post("/signup-admin", Upload, async (req, res) => {
//   await userRegister(req.body, ROLE.admin, res);
// });

// // Promoter Registeration
// router.post("/signup-promoter", Upload, async (req, res) => {
//   await userRegister(req.body, ROLE.promoter, res);
// });

// Super Admin Registration Route
// router.post("/signup-superadmin", async (req, res) => {
//   await userRegister(req.body, ROLE.superadmin, res);
// });

// Users Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});

// // Admin Login Route
// router.post("/login-admin", async (req, res) => {
//   await userLogin(req.body, ROLE.admin, res);
// });

// router.post("/login-promoter", async (req, res) => {
//   await userLogin(req.body, ROLE.promoter, res);
// });

// Super Admin Login Route
// router.post("/login-superadmin", async (req, res) => {
//   await userLogin(req.body, ROLE.superadmin, res);
// });

// Super Admin Protected Route
router.get(
  "/admin-protected",
  userAuth,
  checkRole([ROLE.admin]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

module.exports = router;
