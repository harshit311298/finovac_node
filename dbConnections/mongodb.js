const mongoose = require("mongoose");
const config = require("../config/config");
const DB_URL = global.gConfig.database;

mongoose.connect(
  DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, result) => {
    if (err) {
      console.log("mongodb connection error");
      throw err;
    } else {
      console.log("DB connected succcessfully");
    }
  }
);