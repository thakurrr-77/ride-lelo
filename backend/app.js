const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./routes/user.routes.js')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()


const connectToDb = require('./db/db.js')
connectToDb()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("helo")
})

app.use('/users',userRoutes)
module.exports = app

