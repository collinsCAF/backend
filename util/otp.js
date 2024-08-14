const crypto = require('crypto');
const nodemailer = require('nodemailer');



const sendMessages = (name, email, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_SERVICE_USER,
        to: "Vitetemile@gmail.com",
        subject: 'Dontation Info',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Message Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      padding: 10px 0;
    }
    .header img {
      width: 90%;
      height: auto;
    }
    .content h1 {
      color: #333333;
      margin: 20px 0;
    }
    .content h2 {
      color: #4CAF50;
      margin: 20px 0;
    }
    .content p {
      color: #555555;
      line-height: 1.6;
    }
    .footer {
      margin-top: 20px;
      color: #888888;
      font-size: 12px;
    }
    .footer a {
      color: #888888;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBL7FSfy5nrmsOh1oaD6w4bk32-t0i2Hdlow&s" alt="Company Logo">
    <div class="content">
      <h1>User Message Notification</h1>
      <h2>Name: ${name}</h2>
      <h2>Email: ${email}</h2>
      <h2>Message: ${message}</h2>
      <p>Please review the message and take the necessary actions.</p>
    </div>
    <div class="footer">
      <p>Company Name</p>
      <p>1234 Street Address, City, State, ZIP</p>
      <p><a href="mailto:support@company.com">support@company.com</a></p>
    </div>
  </div>
</body>
</html>

    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('error', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};



module.exports = {  sendMessages };
