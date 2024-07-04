const mongoose = require("mongoose");

const AdSubscriptionsSchema = mongoose.Schema({
  AdID: String,
  UserID: String,
  AdName: String,
  UserName: String,
  TransactionDate: String,
  MpesaReceiptNumber: String,
  PhoneNumber: String,
  Amount: String,
  Plan: String,
});
const AdSubscriptions = mongoose.model(
  "AdSubscriptions",
  AdSubscriptionsSchema
);

module.exports = AdSubscriptions;
