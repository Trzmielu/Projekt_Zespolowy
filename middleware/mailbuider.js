const mailgun = require("mailgun-js");

async function MailSender(from, to, subject, text, deliverytime) {
  const DOMAIN = process.env.MG_DOMAIN;
  const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});
  const data = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    "o:deliverytime": deliverytime
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = MailSender
