const express = require('express');
const router = express.Router();
const admin = require('../../firebaseAdmin');
const db = admin.firestore();

const verifyToken = require('../middleware/verifyToken');

// Create new user
router.post('/', verifyToken, async (req, res) => {
  try {
      const userEmail = req.user.email; // Extracted from verified token

      // Use userEmail as the document ID
      const userRef = db.collection('users').doc(userEmail);
      await userRef.set({ email: userEmail, timezone: 'UTC' }, { merge: true });

      res.status(201).json({ message: "User created successfully with default timezone" });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Update time zone
router.post('/timezone', verifyToken, async (req, res) => {
  try {
      const { timezone } = req.body;
      const userEmail = req.user.email; // Extracted from verified token

      // Use userEmail as the document ID
      const userRef = db.collection('users').doc(userEmail);
      await userRef.update({ timezone });

      res.status(200).json({ message: "Timezone updated successfully" });
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