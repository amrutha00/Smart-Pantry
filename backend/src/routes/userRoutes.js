const express = require('express');
const router = express.Router();
const admin = require('../../firebaseAdmin');
const db = admin.firestore();

const verifyToken = require('../middleware/verifyToken');

// Create new user
router.post('/', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email; // Extracted from verified token
        const { name } = req.body; // Extract name from request body

        // Validate the name
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Use userEmail as the document ID
        const userRef = db.collection('users').doc(userEmail);
        await userRef.set({ 
            email: userEmail, 
            timezone: 'UTC', 
            name: name 
        }, { merge: true });

        res.status(201).json({ message: "User created successfully with default timezone and name" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Update time zone
router.post('/details', verifyToken, async (req, res) => {
    try {
        const { timezone, name } = req.body;
        const userEmail = req.user.email; // Extracted from verified token

        // Create an update object
        const updateData = {};
        if (timezone) updateData.timezone = timezone;
        if (name) updateData.name = name;

        // Check if the update data is not empty
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
        }

        // Use userEmail as the document ID
        const userRef = db.collection('users').doc(userEmail);
        await userRef.update(updateData);

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get User details
router.get('/', verifyToken, async (req, res) => {
  try {
      const userEmail = req.user.email; 

      // Use userEmail to fetch the user document
      const userRef = db.collection('users').doc(userEmail);
      const doc = await userRef.get();

      if (!doc.exists) {
          return res.status(404).json({ message: "User not found" });
      }

      const userData = doc.data();
      res.status(200).json({ message: "User details fetched successfully", data: userData });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;