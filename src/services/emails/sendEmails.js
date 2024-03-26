import nodemailer from "nodemailer";
import { htmlCode } from "./emailTemplate.js";
import jwt from "jsonwebtoken";

export const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  let token = jwt.sign({ email }, "sendingEmails");

  const info = await transporter.sendMail({
    from: `"Hady Awny" <${process.env.EMAIL_NAME}>`, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    html: htmlCode(token), // html body
  });

  console.log("Message sent: %s", info.messageId);
};
