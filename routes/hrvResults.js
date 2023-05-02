const express = require('express');

const router = express.Router();

// controller functions
const { getHRVdata } = require('../controllers/hrvDataController');

router.get('/', getHRVdata);

module.exports = router