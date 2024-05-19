const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URI;

const connectToDb = async () => {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Connection to Database Established");
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = connectToDb;
