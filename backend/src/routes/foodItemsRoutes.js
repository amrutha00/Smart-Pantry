const express = require('express');
const FoodItem = require('../models/FoodItem');
const router = express.Router();

// Middleware to verify user token
const verifyToken = require('../middleware/verifyToken');

// POST - Create a new food item
router.post('/food-items', verifyToken, async (req, res) => {
    try {
      const { name, boughtDate, expiryDate } = req.body;
      const foodItem = new FoodItem({ userId: req.user.user_id, name, boughtDate, expiryDate });
      await foodItem.save();
      res.status(201).json({ message: "OK", data: foodItem });
    } catch (error) {
      res.status(400).json({ message: error.message, data: {} });
    }
  });
  

// GET - List all food items for a user
router.get('/food-items', verifyToken, async (req, res) => {
    try {
      const foodItems = await FoodItem.find({ userId: req.user.user_id });
      res.status(200).json({ message: "OK", data: foodItems });
    } catch (error) {
      res.status(500).json({ message: error.message, data: {} });
    }
  });
  
// PUT - Update a food item
router.put('/food-items/:id', verifyToken, async (req, res) => {
    try {
      const update = req.body;
      const foodItem = await FoodItem.findOneAndUpdate({ _id: req.params.id, userId: req.user.user_id }, update, { new: true });
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found", data: {} });
      }
      res.status(200).json({ message: "OK", data: foodItem });
    } catch (error) {
      res.status(400).json({ message: error.message, data: {} });
    }
  });
  

// DELETE - Delete a food item
router.delete('/food-items/:id', verifyToken, async (req, res) => {
    try {
      const foodItem = await FoodItem.findOneAndDelete({ _id: req.params.id, userId: req.user.user_id });
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found", data: {} });
      }
      res.status(200).json({ message: "Food item deleted", data: {} });
    } catch (error) {
      res.status(500).json({ message: error.message, data: {} });
    }
  });
  

module.exports = router;
