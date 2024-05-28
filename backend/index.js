// DOTENV
require('dotenv').config()
// EXPRESS
const express = require('express')
const app = express()
const port = process.env.PORT || 3500
app.use(express.json())
// MIDDLEWARE
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
// CORS
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions))
// DB
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')
connectDB()
// listen to server and connect to MongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => console.log(`Server running on port ${port}`))
})
// listen to connection error
mongoose.connection.on('error', err => {
    console.log(err)
})
