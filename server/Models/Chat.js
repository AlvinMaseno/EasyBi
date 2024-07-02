const mongoose = require("mongoose");

const ChatMessageSchema = mongoose.Schema({
  Message: String,
  DateSent: Date,
  SenderID: String,
});

const ChatSchema = mongoose.Schema({
  Messages: [ChatMessageSchema],
  InquirerID: String,
  InquireeID: String,
  LastModified:Date
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
