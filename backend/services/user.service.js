const userModel = require('../models/user.model.js')

module.exports.createUser = async ({
        firstname,lastname,email,password
    })=>{
        console.log(firstname,lastname)
        if (!firstname || !email || !password){
            throw new Error('All field are required')
        }
        const user = userModel.create({
            fullname:{
                firstname,
                lastname
            },
            email,
            password,
        })

        return user
    }