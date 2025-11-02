const express = require("express")
const { body } = require("express-validator")
const userController = require("../controllers/user.controller.js")
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.get('/profile',authMiddleware.authUser,userController.getUserProfile)

router.post('/register',[
    body('email').isEmail().withMessage('InvalidEmail'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name should be at least 3 character long'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 characters long')
],userController.registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('InvalidEmail'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 characters long')
    ],userController.loginUser
)

router.get('/logout', authMiddleware.authUser ,userController.logoutUser)

module.exports = router