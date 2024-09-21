const express = require("express")
const router = express.Router()
const { allUsers} = require("../controllers/User")


router.get('/users', allUsers)


module.exports = router;