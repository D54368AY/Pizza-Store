const mongoose = require("mongoose");
const pizzaSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("pizza", pizzaSchema);
