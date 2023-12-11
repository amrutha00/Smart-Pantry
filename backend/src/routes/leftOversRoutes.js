const express = require('express');
const LeftOver = require('../models/LeftOvers');
const router = express.Router();
const moment = require('moment-timezone');
const admin = require('../../firebaseAdmin');
const db = admin.firestore();

// Middleware to verify user token


const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        // Fetch user's timezone from Firestore
        const userRef = db.collection('users').doc(req.user.email);
        const doc = await userRef.get();
        const userData = doc.data();
        const timezone = userData ? userData.timezone : 'UTC';
  
        // Fetch food items from MongoDB
        const leftOversItems = await LeftOver.find({ userId: req.user.user_id });
        //console.log(leftOversItems);
        const currentDate = moment().tz(timezone);
  
        const transformedFoodItems = leftOversItems.map(item => {
            const expiryDate = moment(item.expiryDate).tz(timezone);
            const isExpired = currentDate.isAfter(expiryDate);
            const numberOfDays = isExpired ? 0 : expiryDate.diff(currentDate, 'days');
  
            return { 
                ...item.toObject(), 
                isExpired, 
                NumberOfDaysToExpire: numberOfDays 
            };
        });
  
        res.status(200).json({ message: "OK", data: transformedFoodItems });
    } catch (error) {
        res.status(500).json({ message: error.message, data: {} });
    }
  });

  router.get('/all', verifyToken, async (req, res) => {
    try {
        // Fetch user's timezone from Firestore
        const userRef = db.collection('users').doc(req.user.email);
        const doc = await userRef.get();
        const userData = doc.data();
        const timezone = userData ? userData.timezone : 'UTC';
  
        // Fetch food items from MongoDB
        const leftOversItems = await LeftOver.find({ userId: { $ne: req.user.user_id } });
        //console.log(leftOversItems);
        const currentDate = moment().tz(timezone);
  
        const transformedFoodItems = leftOversItems.map(item => {
            const expiryDate = moment(item.expiryDate).tz(timezone);
            const isExpired = currentDate.isAfter(expiryDate);
            const numberOfDays = isExpired ? 0 : expiryDate.diff(currentDate, 'days');
  
            return { 
                ...item.toObject(), 
                isExpired, 
                NumberOfDaysToExpire: numberOfDays 
            };
        });
  
        res.status(200).json({ message: "OK", data: transformedFoodItems });
    } catch (error) {
        res.status(500).json({ message: error.message, data: {} });
    }
  });

router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, quantity, expiryDate } = req.body;
       const num_quantity = parseInt(quantity);
        const userId = req.user.user_id;
        //console.log(userId);
        // Fetch user's timezone from Firestore
        const userRef = db.collection('users').doc(req.user.email);
        const doc = await userRef.get();
        const userData = doc.data();
        const timezone = userData ? userData.timezone : 'UTC';
        const postedDate = moment().tz(timezone).toDate();
  
        // Check if the item is already expired
        const existingItem = await LeftOver.findOne({
            userId,
            name: { $regex: new RegExp('^' + name + '$', 'i') }, // Case-insensitive search
            expiryDate: new Date(expiryDate) // Check for the same expiry date
        });

        if (existingItem) {
            // Item with similar name and expiry date exists, update the count
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json({ message: "Item exists, count updated", data: existingItem });
        }
        if (moment().tz(timezone).isAfter(moment(expiryDate))) {
            return res.status(400).json({ message: "The item is already expired", data: {} });
        }
        if(!isNaN(num_quantity) && num_quantity <= 0){
            return res.status(400).json({message: "Quantity must be greater than 0",data:{}});
        }

  
        const imageUrl = await fetchFoodItemImage(name);
        const contact = userData.email;

        const leftOverItem = new LeftOver({ userId, name,contact, postedDate,quantity,expiryDate, imageUrl });
        await leftOverItem.save();
        res.status(201).json({ message: "OK", data: leftOverItem });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, data: {} });
    }
  });

// Update Leftover Food Item
router.put('/:id', verifyToken, async (req, res) => {
    try {
      const { name, quantity, expiryDate } = req.body;
      const num_quantity = parseInt(quantity);
      //console.log("in put",name,quantity,quantity===0, Number(quantity)===0);
      const userId = req.user.user_id;
      const itemId = req.params.id;
      const imageUrl = await fetchFoodItemImage(name); // Fetch new image URL

      // Fetch user's timezone from Firestore...
      // [The same code you used in the previous endpoint]
      const userRef = db.collection('users').doc(req.user.email);
      const doc = await userRef.get();
      const userData = doc.data();
      const timezone = userData ? userData.timezone : 'UTC';
      const postedDate = moment().tz(timezone).toDate();
  
      // Check if the item exists and belongs to the user
      const existingItem = await LeftOver.findById(itemId);
      if (!existingItem || existingItem.userId !== userId) {
        return res.status(404).json({ message: 'Item not found for the user', data: {} });
      }
      
      if(!isNaN(num_quantity) && num_quantity <= 0){
        return res.status(400).json({message: "Quantity must be greater than 0",data:{}});
    }

      // Check if the item is already expired
      if (moment().tz(timezone).isAfter(moment(expiryDate))) {

        return res.status(400).json({ message: 'The item has expired. Please delete the item', data: {} });
      }
  
      // Update the item fields
      existingItem.name = name || existingItem.name;
      existingItem.quantity = quantity || existingItem.quantity;
      existingItem.expiryDate = expiryDate || existingItem.expiryDate;
      existingItem.postedDate = postedDate;
      existingItem.imageUrl = imageUrl;
      await existingItem.save();
      res.status(200).json({ message: 'Item updated successfully', data: existingItem });
    } catch (error) {
      res.status(400).json({ message: error.message, data: {} });
    }
  });
  
  // Delete Leftover Food Item
router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const userId = req.user.user_id;
      const itemId = req.params.id;
  
      // Check if the item exists and belongs to the user
      const existingItem = await LeftOver.findById(itemId);
      if (!existingItem || existingItem.userId !== userId) {
        return res.status(404).json({ message: 'Item not found or unauthorized', data: {} });
      }
  
      // Delete the item
      await LeftOver.findByIdAndDelete(itemId);
      res.status(200).json({ message: 'Item deleted successfully', data: {} });
    } catch (error) {
      res.status(400).json({ message: error.message, data: {} });
    }
  });
  module.exports = router;

const axios = require('axios');
async function fetchFoodItemImage(foodName) {
    const apiKey = 'a4a6dbafa80448fdba702620b1258d93'; // Replace with your actual API key
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${foodName}&apiKey=${apiKey}&number=1`;
    
    try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
            return `https://spoonacular.com/cdn/ingredients_100x100/${response.data.results[0].image}`;
        }
        return null;
    } catch (error) {
        console.error('Error fetching food item image:', error);
        return null;
    }
}