const userModel = require('../models/user.model.js')
const userService = require('../services/user.service.js')
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

    const token = user.generateAuthToken()

    res.status(201).json({token,user})
}