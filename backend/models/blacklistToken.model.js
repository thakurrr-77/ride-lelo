const mongoose = require('mongoose')

const blacklistTokenSchema = mongoose.Schema({
    token:{
        type:String,                
        required:true,  
        unique:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: '1d'  // Token will be removed after 1 days
    }
})

module.exports = mongoose.model('BlacklistToken',blacklistTokenSchema)