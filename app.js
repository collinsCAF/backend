require('dotenv').config();
const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const authRouter = require('./Routes/Auth')
const QuestionRouter = require('./Routes/Question')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch(e) {
      res.status(400).json({ message: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(middleware.requestLogger)

app.use('/api/auth', authRouter)
app.use('/api/questions', QuestionRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app