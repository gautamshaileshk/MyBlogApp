const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
