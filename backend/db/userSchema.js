const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    required: true,
    unique: true,
  },
  uemail: {
    type: String,
    required: true,
  },
  uage: {
    type: Number,
    required: true,
  },
  upassword: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("user", userSchema);
