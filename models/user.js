const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userID: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
