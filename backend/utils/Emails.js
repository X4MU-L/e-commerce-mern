const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: Number(process.env.SMTP_PORT) == 465 ? true : false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendMail = async (receiverEmail, subject, body) => {
  console.log(
    "Sending email to:",
    receiverEmail,
    `${process.env.FROM_NAME} okoli@${process.env.FROM_EMAIL}`
  );
  await transporter.sendMail({
    from: {
      name: process.env.FROM_NAME,
      address: `okoli@${process.env.FROM_EMAIL}`,
    },
    to: receiverEmail,
    subject: subject,
    html: body,
  });
};
