const userModel = require('../models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklistTokenModel = require('../models/blacklistToken.model.js')
const captianModel = require('../models/captian.model.js')

module.exports.authUser = async (req,res,next) => {

    const token = req.headers?.authorization ? req.headers.authorization.split(' ')[1] :(req.cookies?.token || null);

    const isBlacklisted = await blacklistTokenModel.findOne({token : token});

    if (isBlacklisted){
        return res.status(401).json({message:'Unauthorized'})
    }
    if (!token){
        return res.status(401).json({message:'Access denied. No token provided'})
    }
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRETE)
        const user = await userModel.findById(decoded._id)
        
        req.user = user
        return next()
    }
    catch (error) {
        return res.status(401).json({message:'Invalid token'})
    }
}

module.exports.authCaptian = async (req,res,next) => {

    const token = req.headers?.authorization ? req.headers.authorization.split(' ')[1] :(req.cookies?.token || null);   

    const isBlacklisted = await blacklistTokenModel.findOne({token : token});
    if (isBlacklisted){
        return res.status(401).json({message:'Unauthorized'})
    }
    if (!token){
        return res.status(401).json({message:'Access denied. No token provided'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRETE)
        const captian = await captianModel.findById(decoded._id)      
        req.captian = captian
        return next()
    }
    catch (error) {
        return res.status(401).json({message:'Unauthorized'})
    }
}   
    