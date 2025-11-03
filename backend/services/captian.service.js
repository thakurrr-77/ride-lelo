const captianModel = require('../models/captian.model.js')

module.exports.createCaptian = async ({
    firstname,email,password,vehicleNumber,color,capacity,vehicleType
})=>{  
    console.log(firstname,email,password,vehicleNumber,color,capacity,vehicleType);
    if (!firstname || !email || !password || !vehicleNumber || !color || !capacity || !vehicleType){
        throw new Error('All field are required')
    }   
    const captian = captianModel.create({
        fullname:{
            firstname 
        },
        email,
        password,
        vehicle:{
            plate:vehicleNumber,
            vehicleType,
            color,
            capacity,
        }
    })
    return captian
}