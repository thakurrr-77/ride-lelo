const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            required : true,
            minlength : [3,'First name should be at least 3 character'],
        },
        lastname:{
            type: String,
            minlength : [3,'First name should be at least 3 character'],
        }
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type : String,
        required : true,
        select : false
    },
    socketId:{
        type:String
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id},process.env.JWT_SECRETE)
    return token
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10)
}

const userModel = mongoose.model('user',userSchema)

module.exports = userModel