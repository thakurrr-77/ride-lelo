const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware.js');
const captianController = require('../controllers/captian.controller.js');
const {body} = require('express-validator');

// Captian registration
router.post('/register',[
    body('fullname.firstname').isLength({min:3}).withMessage('First name should be at least 3 character'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 character'),
    body('vehicle.color').isLength({min:3}).withMessage('Vehicle color should be at least 3 character'),
    body('vehicle.plate').isLength({min:3}).withMessage('Vehicle plate should be at least 3 character'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Capacity should be at least 1'),
    body('vehicle.vehicleType').isIn(['car','motercycle','auto']).withMessage('Vehicle type must be car, motorcycle or auto')
],captianController.registerCaptian);

router.post('/login',[
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 character')
],captianController.loginCaptian);

router.get('/profile',authMiddleware.authCaptian,captianController.getCaptianProfile);

router.get('/logout',authMiddleware.authCaptian,captianController.logoutCaptian);

module.exports = router;