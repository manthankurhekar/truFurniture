const config = require("../config/config");
const sendMail = async (fromEmail, toEmail, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.userPass,
    },
  });
  let info = await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    subject,
    text,
    html,
  });
  return info;
};

module.exports = { sendMail };