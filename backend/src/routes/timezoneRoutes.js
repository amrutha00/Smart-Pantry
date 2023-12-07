const express = require('express');
const moment = require('moment-timezone');
const router = express.Router();

// GET - List all available timezones
router.get('/', (req, res) => {
    try {
        const timezones = moment.tz.names();
        res.status(200).json({ message: "OK", data: timezones });
    } catch (error) {
        res.status(500).json({ message: error.message, data: {} });
    }
});

module.exports = router;
