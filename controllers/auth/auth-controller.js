const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// =============================
// ✅ REGISTER USER
// =============================
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isFirstUser = (await User.countDocuments()) === 0;

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: isFirstUser ? "admin" : "user",
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// =============================
// ✅ LOGIN USER
// =============================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "User doesn't exist. Please register first.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // ✅ Make sure JWT_SECRET is loaded correctly
    const secret = (process.env.JWT_SECRET || "").trim();
    if (!secret) {
      console.error("❌ JWT_SECRET is missing from environment!");
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration: JWT secret missing",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        userName: existingUser.userName,
      },
      secret,
      { expiresIn: "60m" }
    );

    // ✅ Detect environment
    const isDev = process.env.NODE_ENV !== "production";

    // ✅ Set secure cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: !isDev, // true in production (HTTPS)
        sameSite: isDev ? "Lax" : "None",
        path: "/",
        maxAge: 3600000, // 1 hour
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          userName: existingUser.userName,
          role: existingUser.role,
        },
      });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// =============================
// ✅ LOGOUT USER
// =============================
const logoutUser = (req, res) => {
  const isDev = process.env.NODE_ENV !== "production";

  res
    .clearCookie("token", {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      path: "/",
    })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
};

// =============================
// ✅ AUTH MIDDLEWARE
// =============================
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const secret = (process.env.JWT_SECRET || "").trim();

    // ✅ Debug logs (remove in production)
    console.log("🔍 Verifying token using secret =>", secret);

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
