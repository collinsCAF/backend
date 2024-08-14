require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const  {sendMessages} = require("./util/otp")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("This API is running live🥳");
});

app.post("/donation", async (req, res) => {
    const { name, email, message } = req.body;
  
  await  sendMessages(name, email, message)
    res.send("This API is running live🥳");
    //   .then(() => {
    //     res.send("successful");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     res.status(500).send("Failed to send message");
    //   });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
