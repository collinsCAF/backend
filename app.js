const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const authRouter = require('./Routes/Auth')
const userRouter = require('./Routes/User')
const middleware = require('./utils/middleware')
const session = require('express-session');
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
    
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)


app.use('/api/auth', authRouter)
app.use('/api/profile', userRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app