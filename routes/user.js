const express = require('express')

// controller functions
const { loginUser, signupUser, getUsers } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

//get signed up users
router.get('/users', getUsers)

module.exports = router