var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
  Name: String,
  UserName: String,
  Email: String,
  HashedPassword: String,
  UserImageUrl: String,
  Contact: String,
  DateCreated: Date,
  Enabled: Boolean,
  LastKnownCoordinates: { latitude: String, longitude: String },
});

const UserData = mongoose.model("UserData", UserSchema);

module.exports = UserData;
