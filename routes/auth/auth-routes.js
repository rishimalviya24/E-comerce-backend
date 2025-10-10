const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, async (req, res) => {
  console.log("🔍 Cookies received:", req.cookies);
  console.log("🔍 Headers:", req.headers);
  
  res.status(200).json({
    success: true,
    user: req.user,
  });
});


module.exports = router;
