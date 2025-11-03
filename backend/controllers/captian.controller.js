const captianModel = require("../models/captian.model");
const {validationResult} = require('express-validator');
const captianService = require("../services/captian.service.js");
const blacklistTokenModel = require("../models/blacklistToken.model.js");


module.exports.registerCaptian = async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {fullname,email,password,vehicle} = req.body;

    const captianExists = await captianModel.findOne({email});

    if (captianExists){
        return res.status(400).json({message:'Captian with this email already exists'})
    }

    hashedPassword = await captianModel.hashPassword(password);

    try {
        const captian = await captianService.createCaptian({
            firstname:fullname.firstname,
            email,
            password : hashedPassword,
            vehicleNumber:vehicle.plate,
            color:vehicle.color,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType
        });
        const token = captian.generateAuthToken();
        return res.status(201).json({token,captian})
    } catch (error) {
        return  res.status(500).json({message:error.message})
    } 
}


module.exports.loginCaptian = async (req,res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password} = req.body;

    try {
        const captian = await captianModel.findOne({email}).select('+password');
        if (!captian){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const isPasswordValid = await captian.comparePassword(password);
        if (!isPasswordValid){
            return res.status(401).json({message:'Invalid email or password'})
        }
        const token = captian.generateAuthToken();
        res.cookie('token',token);
        return res.status(200).json({token,captian})
    } catch (error) {
        return res.status(500).json({message:error.message})
    } 
}

module.exports.getCaptianProfile = async (req,res) =>{
   res.status(200).json({captian:req.captian})
}


module.exports.logoutCaptian = async (req,res) =>{  
    const token = req.headers?.authorization ? req.headers.authorization.split(' ')[1] :(req.cookies?.token || null);
    await blacklistTokenModel.create({token})
    res.clearCookie('token')
    res.status(200).json({message:'Logged out successfully'})
}
