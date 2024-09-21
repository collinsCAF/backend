require('dotenv').config()

let PORT = process.env.PORT || 4100

let EMAIL_SERVICE_USER = process.env.EMAIL_SERVICE_USER
let EMAIL_SERVICE_PASS = process.env.EMAIL_SERVICE_PASS
let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
let GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET


let REFRESH_TOKEN = process.env.REFRESH_TOKEN
let SECRET_KEY = process.env.SECRET_KEY

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI


module.exports = {
    MONGODB_URI,
    PORT,
    EMAIL_SERVICE_USER,
    EMAIL_SERVICE_PASS,
    REFRESH_TOKEN,
    SECRET_KEY,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
}