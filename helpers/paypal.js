const paypal = require("paypal-rest-sdk");

// PayPal Sandbox configuration
// To get these credentials:
// 1. Go to https://developer.paypal.com/dashboard/applications/sandbox
// 2. Create or select an app
// 3. Copy the Client ID and Secret
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // "sandbox" for testing, "live" for production
  client_id: process.env.PAYPAL_CLIENT_ID || "ATRwbtQaQJPXUBSiiOSNLbDa4PLqVNdfqSuXu8ML3Jg2bDBV58bR3lDzPkg6sibT8v1snGYO3pUyC2OB",
  client_secret: process.env.PAYPAL_CLIENT_SECRET || "EGWnXZlNCJuTrCoaWND960DYlSgNzSTlVQohwA9T-FRjaOw5_LF00Ui8Q_-6C7kgB3CrFz6roaA_BehO",
});

module.exports = paypal;
