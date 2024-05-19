var mongoose = require("mongoose");

var VerificationSchema = mongoose.Schema({
  VerificationID:Number,  
  Code:Number
});

const VerificationData = mongoose.model("VerificationData", VerificationSchema);

module.exports = VerificationData;
