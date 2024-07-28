const nodemailer = require('nodemailer');

// send email function
const sendEmail = options => {
  // create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the Email options
  const mailOptions = {
    from: '<Majd Alhourani> majd.aldein.alhourani@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the email
  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
