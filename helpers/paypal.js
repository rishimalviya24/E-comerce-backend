const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "ATRwbtQaQJPXUBSiiOSNLbDa4PLqVNdfqSuXu8ML3Jg2bDBV58bR3lDzPkg6sibT8v1snGYO3pUyC2OB",
  client_secret: "EGWnXZlNCJuTrCoaWND960DYlSgNzSTlVQohwA9T-FRjaOw5_LF00Ui8Q_-6C7kgB3CrFz6roaA_BehO",
});

module.exports = paypal;
