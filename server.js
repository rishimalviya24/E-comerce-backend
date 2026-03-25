require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express();
const PORT = process.env.PORT || 5000;

/////////////////////////////////////////////////////
// ✅ CORS FIX (PRODUCTION + DEV SAFE)
/////////////////////////////////////////////////////

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://e-commerce-ygi7.vercel.app", // old
  "https://e-comerce-ok6v.onrender.com", // render frontend (if any)
  "https://e-comerce-ehckh61bg-rishi-malviyas-projects.vercel.app", // ✅ YOUR CURRENT FRONTEND
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // TEMP: allow all (optional, remove later)
      return callback(null, true);
      // return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

app.options("*", cors());

/////////////////////////////////////////////////////
// ✅ MIDDLEWARE
/////////////////////////////////////////////////////

app.use(cookieParser());
app.use(express.json());

/////////////////////////////////////////////////////
// ✅ DB CONNECTION
/////////////////////////////////////////////////////

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI missing");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

/////////////////////////////////////////////////////
// ✅ ROUTES (IMPORTANT PREFIX: /api)
/////////////////////////////////////////////////////

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

/////////////////////////////////////////////////////
// ✅ HEALTH CHECK
/////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 E-Commerce Backend running",
  });
});

/////////////////////////////////////////////////////
// ✅ 404 HANDLER (IMPORTANT)
/////////////////////////////////////////////////////

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/////////////////////////////////////////////////////
// ✅ ERROR HANDLER
/////////////////////////////////////////////////////

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/////////////////////////////////////////////////////
// ✅ SERVER START
/////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});