const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureAuth } = require('../middleware/auth');

const ExerciseEntry = require('../models/exerciseModel');
/* const PatientIdFetcher = require('../patientIdFetcher'); */

router.post('/', async (req, res) => {
  try {
    const url = req.headers.referer;
    asPatient = url.match(/\/(\w+)$/)[1];

    const { exercise_date, exercise_type, body, exercise_duration_hour, exercise_duration_minute } = req.body;

    // Creating a new diary entry which includes date, text (body), and user info
    const newEntryExercise = await ExerciseEntry.create({
      exercise_date,
      exercise_type,
      body,
      exercise_duration_hour,
      exercise_duration_minute,
      user: asPatient
    });

    console.log('New exercise entry created:', newEntryExercise);
    res.redirect('/student_exercise_plan');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

router.get('/', ensureAuth, async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  try {
    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);
    let exerciseEntries;

    if (decoded.role === 'nurse') {
      const url = req.headers.referer;
      const userId = url.match(/\/(\w+)$/)[1];
      exerciseEntries = await ExerciseEntry.find({ user: userId }).sort({ exercise_date: -1 }).skip(skip).limit(10).lean();
    } else if (decoded.role === 'patient') {
      const userId = decoded._id;
      exerciseEntries = await ExerciseEntry.find({ user: userId }).sort({ exercise_date: -1 }).skip(skip).limit(10).lean();
    }

    res.json(exerciseEntries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch exercise entries', error: err });
  }
});

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const exerciseEntry = await ExerciseEntry.findById(req.params.id);

    if (!exerciseEntry) {
      return res.status(404).json({ message: 'ExerciseEntry not found' });
    }

    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);


    await ExerciseEntry.findByIdAndDelete(req.params.id);

    res.json({ message: 'ExerciseEntry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete ExerciseEntry', error: err });
  }
});

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const exerciseEntry = await ExerciseEntry.findById(req.params.id).lean();
    res.json(exerciseEntry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
