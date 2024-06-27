const mongoose = require("mongoose");

const UserSearchDataSchema = mongoose.Schema({
  UserID:String,
  UserName:String,
  SearchValue:String,
  DateTime:Date,
  Coordinates: { longitude: String, latitude: String }
  
});
const UserSearchData = mongoose.model("UserSearchData", UserSearchDataSchema);

module.exports = UserSearchData;
