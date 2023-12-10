const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
//const { checkExpiredItems } = require('./expiredItemsHandlerRoutes');

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
  (async()=>{
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      // const userRef = admin.firestore().collection('users').doc(uid);
      const doc = await userRef.get();
      const userData = doc.data();
      const timezone = userData ? userData.timezone : 'UTC';

      // Call function to check for expired items and notify user
      //await checkExpiredItems(uid, timezone);
      // Use uid to get user information from your database, if needed
      res.status(200).send(`User verified with UID: ${uid}`);
    } catch (error) {
      // Handle error
      res.status(401).send('Invalid token');
    }
  })();
  // admin.auth().verifyIdToken(idToken)
  //   .then(decodedToken => {
  //     const uid = decodedToken.uid;
  //     //const userRef = admin.firestore().collection('users').doc(uid);
  //     const doc = await userRef.get();
  //     const userData = doc.data();
  //     const timezone = userData ? userData.timezone : 'UTC';

  //     // Call function to check for expired items and notify user
  //     await checkExpiredItemsAndNotify(uid, timezone);
  //     // Use uid to get user information from your database, if needed
  //     res.status(200).send(`User verified with UID: ${uid}`);
  //   })
  //   .catch(error => {
  //     // Handle error
  //     res.status(401).send('Invalid token');
  //   });
});

module.exports = router;
