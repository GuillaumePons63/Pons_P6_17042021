const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: { type: String, require: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
