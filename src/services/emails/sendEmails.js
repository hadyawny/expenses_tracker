import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendVerifyEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let token = jwt.sign({ email }, process.env.EMAIL_KEY);

  const link = process.env.baseURL + `api/v1/users/verifyEmail/${token}`;

  const info = await transporter.sendMail({
    from: `"Expenses Tracker" <${process.env.EMAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Welcome To Expenses Tracker, Please Verify Your Email", // Subject line
    html: `<a href=${link}>Click Here To Verify Your Email </a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export const sendResetPassword = async (email,otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });



  const info = await transporter.sendMail({
    from: `"Expenses Tracker" <${process.env.EMAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Reset Password", // Subject line
    html: `<p>Your OTP is ${otp} </p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
};