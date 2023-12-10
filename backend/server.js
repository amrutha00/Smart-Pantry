const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const foodItemsRoutes = require('./src/routes/foodItemsRoutes');
const userRoutes = require('./src/routes/userRoutes');
const timezoneRoutes = require('./src/routes/timezoneRoutes');
const leftOverfoodItemsRoutes = require('./src/routes/leftOversRoutes');
const app = express();

app.use(express.json()); // for parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/timezone', timezoneRoutes);
app.use('/api/food-items', foodItemsRoutes);
app.use('/api/left-overs', leftOverfoodItemsRoutes);
