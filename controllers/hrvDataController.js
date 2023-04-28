const Hrv = require('../models/hrvModel')

const getHRVdata = async (req, res) => {
    try {
      const hrvData = await Hrv.getHRVdata()
      res.status(200).json(hrvData)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }
  
module.exports = { getHRVdata }
