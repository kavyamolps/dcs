require('dotenv').config()

const express=require('express')
const cors=require('cors')
require('./config/db')
const route = require('./router/route')
const appMiddleware = require('./middleware/appMiddleware')

const dcsServer=express()

dcsServer.use(cors())
dcsServer.use(express.json())
dcsServer.use(appMiddleware)
dcsServer.use(route)

const PORT = 3000 || process.env.PORT

dcsServer.get('/',(req,res)=>{
    res.send("Welcome to Decision Companion System Server")
})

dcsServer.listen(PORT,()=>{
    console.log(`Decision Companion System server running on port ${PORT}`);
})