const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  exercise_type: {
    type: String,
    required: true,
  },
  exercise_duration_hour: {
    type: Number,
  },
  exercise_duration_minute: {
    type: Number,
  },
  body: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
