const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const DiaryEntry = require('../models/diaryModel')

const Story = require('../models/StoryModel');

// @desc    Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

router.get('/etusivu_opiskelija', ensureAuth, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);
    const stories = await Story.find({ user: decoded._id }).lean();
    // const stories = await Story.find({}).lean();
    res.render('etusivu_opiskelija', {
      layout: 'etusivu_opiskelija',
      // username: decoded.username,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);
    const stories = await Story.find({ user: decoded._id }).lean();
    // const stories = await Story.find({}).lean();
    res.render('dashboard', {
      // username: decoded.username,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

router.get('/excercise_plan', (req, res) => {
  res.render('excercise_plan', {
    layout: 'excercise_plan',
  });
});

router.get('/etusivu_ammattilainen', (req, res) => {
  res.render('etusivu_ammattilainen', {
    layout: 'etusivu_ammattilainen',
  });
});

router.get('/hrv_measurements', (req, res) => {
  res.render('hrv_measurements', {
    layout: 'hrv_measurements',
  });
});

router.get('/activities_and_diary', ensureAuth, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);
    const diaryEntries = await DiaryEntry.find({ user: decoded._id }).lean();

    diaryEntries.forEach(entry => {
      entry.diary_date_formatted = new Date(entry.diary_date).toLocaleDateString('fi-FI');
    });

    res.render('activities_and_diary', {
      layout: 'activities_and_diary',
      diaryEntries,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
