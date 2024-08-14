require("dotenv").config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const SendMoneyRouter = require("./Router/SendMessage")



const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', SendMoneyRouter);



app.get("/", (req, res) => {
  res.send("This API is running live🥳");
});




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
