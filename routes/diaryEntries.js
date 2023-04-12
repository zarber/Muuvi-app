const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureAuth } = require('../middleware/auth');

const newDiaryEntry = require('../models/diaryModel');

router.post('/', async (req, res) => {
  try {
    console.log('POST request to /diaryEntries');
    console.log('Request body:', req.body);

    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);
    req.body.user = decoded._id;

    const { diary_date, body, emojiClass } = req.body;

    // Creating a new diary which includes date, text (body), emoji and user info
    await newDiaryEntry.create({ diary_date, body, emojiClass, user: req.body.user });
    
    console.log('New diary entry created:', newDiaryEntry);

    res.redirect('/activities_and_diary');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});
module.exports = router;