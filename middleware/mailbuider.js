const mailgun = require("mailgun-js");

async function MailSender(from, to, subject, text) {
  const DOMAIN = process.env.MG_DOMAIN;
  const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});
  const data = {
    from: "Mailgun Sandbox <postmaster@sandboxdb20294f05074fa4b570c0996c4a0a92.mailgun.org>",
    to: to,
    subject: subject,
    text: text
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = MailSender
