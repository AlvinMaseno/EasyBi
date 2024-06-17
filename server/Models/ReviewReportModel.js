const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
  AdID: String,
  ReporterID: String,
  ReporterName: String,
  AdOwnerID: String,
  AdOwnerName: String,
  Report: String,
  DateSent: Date,
});

const ReportData = mongoose.model("Reports", ReportSchema);

const ReviewSchema = mongoose.Schema({
  AdID: String,
  ReviewerName: String,
  ReviewerID: String,
  AdOwnerID: String,
  AdOwnerName: String,
  Review: String,
  Rating: Number,
  DateSent: Date,
  ReviewerImageUrl: String,
});

const ReviewData = mongoose.model("Reviews", ReviewSchema);

const obj = { Report: ReportData, Review: ReviewData };

module.exports = obj;
