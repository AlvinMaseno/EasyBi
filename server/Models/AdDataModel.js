const mongoose = require("mongoose");

const AdDataSchema = mongoose.Schema({
  Name: String,
  KeyWords: String,
  Location: String,
  Pricing: Number,
  Paid: Boolean,
  Contact: String,
  Link: String,
  Coordinates: {
    coordinates: { longitude: String, latitude: String },
    Set: Boolean,
  },
  Details: String,
  UserID: String,
  ImageUrl: Array,
  ExpiryDate: Date,
  Rating: Number,
  NumRated: Number,
  UserName: String,
  Plan: String,
  AverageRating: Number,
  DateCreated: Date,
  Enabled: Boolean,
});

const AdDataModel = mongoose.model("AdData", AdDataSchema);

module.exports = AdDataModel;
