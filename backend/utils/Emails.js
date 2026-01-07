const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  requireTLS: true, // Force TLS for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Cloud platform optimizations
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
  // Mumara-specific settings
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    minVersion: "TLSv1.2",
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
