const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hrvSchema = new Schema ({
    measureDate: {
        type: Date,
        required: true
    },
    readinessValue: {
        type: Number,
        required: true
    },
    stressIndex: {
        type: Number,
        required: true
    },
})

//static get hrv results method
hrvSchema.statics.getHRVdata = async function () {
    const hrvData = await this.find();
    return hrvData;
  };

module.exports = mongoose.model('hrv_result', hrvSchema);