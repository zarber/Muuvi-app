const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authorize, ensureAuth, ensureGuest } = require('../middleware/auth');
const DiaryEntry = require('../models/diaryModel')
const ExerciseEntry = require('../models/exerciseModel')


// @desc    Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

router.get('/etusivu_opiskelija', ensureAuth, authorize('patient'), async (req, res) => {
  try {
    res.render('frontpage_student', {
      layout: 'student/frontpage_student',
      username: req.user.username,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      layout: 'error',
    });
  }
});


//@route authorize('nurse') landing page for nurse
router.get('/potilaslista', ensureAuth, authorize('nurse'), async (req, res) => {
    try {
      res.render('patientlist', {
        layout: 'nurse/patientlist',
        role: req.user.role,
      });
    } catch (err) {
      console.error(err);
      res.render('error/500', {
        layout: 'error',
      });
    }
  }
);


router.get('/salasana_unohtunut', (req, res) => {
  res.render('forgot_pw', {
    layout: 'forgot_pw',
  });
});

router.get('/liikuntasuunnitelma_potilas', (req, res) => {
  res.render('student_excercise_plan', {
    layout: 'student/student_excercise_plan',
  });
});

router.get('/liikuntasuunnitelma/:id', (req, res) => {
  res.render('excercise_plan', {
    layout: 'nurse/excercise_plan',
  });
});

router.get('/aktiviteetit_ja_paivakirja', (req, res) => {
  res.render('activities_and_diary', {
    layout: 'student/activities_and_diary',
  });
});

router.get('/hrv_mittaukset', (req, res) => {
  res.render('hrv_measurements', {
    layout: 'student/hrv_measurements',
  });
});

router.get('/etusivu_ammattilainen/:id', (req, res) => {
  res.render('frontpage_nurse', {
    layout: 'nurse/frontpage_nurse',
  });
});

router.get('/potilaslista', (req, res) => {
  res.render('patientlist', {
    layout: 'nurse/patientlist',
  });
});

module.exports = router;
