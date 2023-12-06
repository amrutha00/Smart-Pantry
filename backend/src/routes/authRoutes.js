const express = require('express');
const router = express.Router();

// Register route
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  admin.auth().createUser({
    email: email,
    password: password
  })
  .then(userRecord => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
    res.status(201).send('User created successfully');
  })
  .catch(error => {
    console.log('Error creating new user:', error);
    res.status(500).send(error.message);
  });
});


// Login route
router.post('/login', (req, res) => {
  const { idToken } = req.body;
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      const uid = decodedToken.uid;
      // Use uid to get user information from your database, if needed
      res.status(200).send(`User verified with UID: ${uid}`);
    })
    .catch(error => {
      // Handle error
      res.status(401).send('Invalid token');
    });
});

module.exports = router;
