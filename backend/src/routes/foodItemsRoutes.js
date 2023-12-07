const express = require('express');
const FoodItem = require('../models/FoodItem');
const router = express.Router();
const moment = require('moment-timezone');
const admin = require('../../firebaseAdmin');
const db = admin.firestore();

// Middleware to verify user token
const verifyToken = require('../middleware/verifyToken');

// POST - Create a new food item
router.post('/', verifyToken, async (req, res) => {
  try {
      const { name, boughtDate, expiryDate } = req.body;
      const userId = req.user.user_id;

      // Fetch user's timezone from Firestore
      const userRef = db.collection('users').doc(req.user.email);
      const doc = await userRef.get();
      const userData = doc.data();
      const timezone = userData ? userData.timezone : 'UTC';
      console.log(timezone);

      // Check if the item is already expired
      if (moment().tz(timezone).isAfter(moment(expiryDate))) {
          return res.status(400).json({ message: "The item is already expired", data: {} });
      }

      const foodItem = new FoodItem({ userId, name, boughtDate, expiryDate });
      await foodItem.save();
      res.status(201).json({ message: "OK", data: foodItem });
  } catch (error) {
      res.status(400).json({ message: error.message, data: {} });
  }
});

// GET - List all food items for a user
router.get('/', verifyToken, async (req, res) => {
    try {
      // Fetch user's timezone from Firestore
      const userRef = db.collection('users').doc(req.user.email);
      const doc = await userRef.get();
      const userData = doc.data();
      const timezone = userData ? userData.timezone : 'UTC';
      console.log(timezone);
  
      // Fetch food items from MongoDB
      const foodItems = await FoodItem.find({ userId: req.user.user_id });
      const transformedFoodItems = foodItems.map(item => {
        const isExpired = isItemExpired(item, timezone);
        return { ...item.toObject(), isExpired };
      });
  
      res.status(200).json({ message: "OK", data: transformedFoodItems });
    } catch (error) {
      res.status(500).json({ message: error.message, data: {} });
    }
});
  
// PUT - Update a food item
router.put('/:id', verifyToken, async (req, res) => {
  try {
      const update = req.body;
      const foodItem = await FoodItem.findOneAndUpdate({ _id: req.params.id, userId: req.user.user_id }, update, { new: true });

      if (!foodItem) {
          return res.status(404).json({ message: "Food item not found", data: {} });
      }

      // Fetch user's timezone from Firestore
      const userRef = db.collection('users').doc(req.user.email);
      const doc = await userRef.get();
      const userData = doc.data();
      const timezone = userData ? userData.timezone : 'UTC';

      const updatedItem = { ...foodItem.toObject(), isExpired: isItemExpired(foodItem, timezone) };

      res.status(200).json({ message: "OK", data: updatedItem });
  } catch (error) {
      res.status(400).json({ message: error.message, data: {} });
  }
});

// DELETE - Delete all food items
router.delete('/expired', verifyToken, async (req, res) => {
  try {
      // Fetch user's timezone from Firestore
      const userRef = db.collection('users').doc(req.user.email);
      const doc = await userRef.get();
      const userData = doc.data();
      const timezone = userData ? userData.timezone : 'UTC';

      // Find and delete all expired food items
      const currentDate = moment().tz(timezone);
      const result = await FoodItem.deleteMany({ 
          userId: req.user.user_id,
          expiryDate: { $lt: currentDate.toDate() } 
      });

      if (result.deletedCount === 0) {
          return res.status(404).json({ message: "No expired food items found", data: {} });
      }

      res.status(200).json({ message: "Expired food items deleted successfully", data: { deletedCount: result.deletedCount } });
  } catch (error) {
      res.status(500).json({ message: error.message, data: {} });
  }
});


// DELETE - Delete a food item
router.delete('/:id', verifyToken, async (req, res) => {
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


function isItemExpired(item, timezone) {
    return moment().tz(timezone).isAfter(moment(item.expiryDate));
}

module.exports = router;
