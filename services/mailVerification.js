import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_MAILTRAP_SERVICE_USER,
    pass: process.env.EMAIL_MAILTRAP_SERVICE_PASSWORD,
  },
});

const transporter = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_META_SERVICE_USER,
    pass: process.env.EMAIL_META_SERVICE_PASSWORD,
  },
});

export const sendVerificationMail = async (userMail, verificationLink) => {
  const message = {
    from: "hw06_contact_app@meta.ua",
    to: userMail,
    subject: "Verification",
    text: `Welcome in out app! To verificate your account please open link - ${verificationLink}`,
    html: `<div style="margin: 30px">
    <h2> Welcome in our app!</h2>
    <p>To verificate your account please tap the <a href="http://localhost:3000/api/users/verification/${verificationLink}">link</a></p>
    </div>`,
  };
  await transport.sendMail(message).then(console.log).catch(console.error);
};
