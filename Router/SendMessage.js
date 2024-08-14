const express = require("express");
const router = express.Router();
const { sendMessages } = require("../util/otp");

router.post("/donation", (req, res) => {
  const { name, email, message } = req.body;

  sendMessages(name, email, message)
    .then(() => {
      res.send("successful");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to send message");
    });
});

module.exports = router;
