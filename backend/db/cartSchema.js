const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("cart", cartSchema);
