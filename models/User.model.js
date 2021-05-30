const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"]
    },
    cwName: { type: String, trim: true, default:""},
  },
  {
    timestamps: true
  }
);

module.exports = model("User", userSchema);

// // need for api call to code wars case sensitive must be exact user name, dont require may not have?
