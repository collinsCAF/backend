const express = require("express")
const router = express.Router()
const {sendMessages} = require("../util/otp")


router.post("/dontation", (req, res)=>{
    const {name, email, message} = req.body;
  
    sendMessages(name,email, message )

res.send("successfull")

})


module.exports = router