const axios = require("axios");

exports.sendMail = async (receiverEmail, subject, body) => {
  console.log(
    "Sending email to:",
    receiverEmail,
    `from ${process.env.FROM_EMAIL}`
  );

  const data = {
    from: `Name <shop@${process.env.FROM_EMAIL}>`,
    to: receiverEmail,
    subject: subject,
    html: body,
  };

  try {
    const response = await axios.post(process.env.MAIL_API_URL, data, {
      headers: {
        Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    });

    console.log("✅ Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to send email: ${error.response?.data?.message || error.message}`
    );
  }
};
