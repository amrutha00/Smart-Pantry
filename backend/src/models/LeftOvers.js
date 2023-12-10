const mongoose = require('mongoose');

const leftOverFoodSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    quantity: { type: String, required: true },
    postedDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    imageUrl: { type: String }
  });
  
  module.exports = mongoose.model('LeftOvers', leftOverFoodSchema);