const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const captianSchema = new mongoose.Schema({
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
        unique:true,
        lowercase:true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
    },
    password:{
        type : String,
        required : true,
        select : false
    },
    socketId:{
        type:String
    },
    
    status:{
        enum:['active','inactive'],
        type:String,
        default:'inactive'
    },
    
    vehicle:{
        color:{
            type:String,
            required:true, 
            minlength : [3,'Vehicle color should be at least 3 character'],
        },
        plate:{
            type:String,
            required:true,  
            unique:true,
            minlength : [3,'Vehicle plate should be at least 3 character'],
        },
        capacity:{
            type:Number,
            required:true,  
            min:[1,'Capacity should be at least 1'],
        },
        vehicleType:{
            type:String,
            required:true,  
            enum:['car','motercycle','auto']
        }
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    }

})


captianSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id},process.env.JWT_SECRETE,{expiresIn:'1d'})
    return token
}

captianSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
} 

captianSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10)
}

module.exports = mongoose.model('captian',captianSchema)