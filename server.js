// require('dotenv').config(); // ✅ load .env

// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// const authRouter = require("./routes/auth/auth-routes");
// const adminProductsRouter = require("./routes/admin/products-routes");
// const adminOrderRouter = require("./routes/admin/order-routes");

// const shopProductsRouter = require("./routes/shop/products-routes");
// const shopCartRouter = require("./routes/shop/cart-routes");
// const shopAddressRouter = require("./routes/shop/address-routes");
// const shopOrderRouter = require("./routes/shop/order-routes");
// const shopSearchRouter = require("./routes/shop/search-routes");
// const shopReviewRouter = require("./routes/shop/review-routes");

// const commonFeatureRouter = require("./routes/common/feature-routes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Enable CORS for frontend with credentials
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGINS.split(","), // split string into array
//     methods: process.env.CORS_METHODS.split(","),
//     credentials: process.env.CORS_CREDENTIALS === "true", // convert string to boolean
//   })
// );

// // ✅ Middleware to parse cookies and JSON body
// app.use(cookieParser());
// app.use(express.json());

// // ✅ Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb+srv://rishi21:DPD4ttywdgG9on1s@cluster0.ggqaea7.mongodb.net/ecommerce")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((error) => {
//     console.error("❌ MongoDB connection error:", error);
//   });

// // ✅ Define Routes
// app.use("/api/auth", authRouter);
// app.use("/api/admin/products", adminProductsRouter);
// app.use("/api/admin/orders", adminOrderRouter);

// app.use("/api/shop/products", shopProductsRouter);
// app.use("/api/shop/cart", shopCartRouter);
// app.use("/api/shop/address", shopAddressRouter);
// app.use("/api/shop/order", shopOrderRouter);
// app.use("/api/shop/search", shopSearchRouter);
// app.use("/api/shop/review", shopReviewRouter);

// app.use("/api/common/feature", commonFeatureRouter);

// // ✅ Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is now running on port ${PORT}`);
// });


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

// ✅ CORS - Allow both local and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", 
  "https://e-commerce-frontend.onrender.com" // 🔁 Replace with YOUR actual Render frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS policy violation'), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // ✅ CRITICAL for cookies
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"], // ✅ Added Cache-Control
  })
);

// ✅ Handle preflight
app.options("*", cors());

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// ✅ Define Routes
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

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ E-Commerce Backend running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});