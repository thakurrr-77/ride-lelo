const userModel = require('../models/user.model.js')
const userService = require('../services/user.service.js')
const blacklistTokenModel = require('../models/blacklistToken.model.js')
const {validationResult} = require('express-validator')


module.exports.registerUser = async (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errors:errors.array()})
    }

    const {fullname:{firstname,lastname}, email,password} = req.body
    
    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname,lastname,email,password:hashPassword
    })

    const userExists = await userModel.findOne({email});
    if(userExists){
        return res.status(400).json({message:'User with this email already exists'})
    }

    const token = user.generateAuthToken()

    res.status(201).json({token,user})
}

module.exports.loginUser = async (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password} = req.body
    console.log(email,password);
    
    const user = await userModel.findOne({email}).select('+password')

    if(!user){
        return res.status(400).json({message:'Invalid email or password'})
    }  
    const isMatch = await user.comparePassword(password)
    console.log(isMatch);
    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'})
    }

    const token = user.generateAuthToken()
    res.cookie('token',token)
    res.status(200).json({token,user})
}

module.exports.getUserProfile = async (req,res,next) => {
    const userId = req.user._id
    const user = await userModel.findById(userId)
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    res.status(200).json({user})
}        

module.exports.logoutUser = async (req,res,next) => {
    const token = req.headers?.authorization ? req.headers.authorization.split(' ')[1] :(req.cookies?.token || null);
    await blacklistTokenModel.create({token})
    res.clearCookie('token')
    res.status(200).json({message:'Logged out successfully'})
}