const captianModel = require("../models/captian.model");
const {validationResult} = require('express-validator');
const captianService = require("../services/captian.service.js");


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
    console.log(hashedPassword);
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