const express = require('express');

const router = express.Router();

// controller functions
const { getHRVdata, postHRVdata } = require('../controllers/hrvDataController');

router.get('/', getHRVdata);

module.exports = router