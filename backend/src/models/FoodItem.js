const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  quantity: { type: String, required: true },
  name: { type: String, required: true },
  boughtDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  imageUrl: { type: String}
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
