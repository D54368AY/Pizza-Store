const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("order", orderSchema);
