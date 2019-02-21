const nm = require('nodemailer');

const _ = require('lodash');
const SMTPConnection = require('nodemailer/lib/smtp-connection');
const chalk = require('chalk');
const logger = require('winston');

const checkConnectionToServer = () => new Promise((resolve, reject) => {
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const client = new SMTPConnection({
    host: emailHost,
    port: emailPort,
    tls: { rejectUnauthorized: false },
  });

  client.connect(() => {
    client.close();
    logger.debug(chalk.green('\t- Email Server: OK'));
    resolve(true);
  });

  client.on('error', (err) => {
    logger.debug(chalk.red('\t- Email Server: Connection to email server could not be established'));
    reject(err);
  });
});

const sendEmail = (toAddress, subject, textEmail, htmlEmail) => new Promise((resolve, reject) => {
  try {
    let emailHost = process.env.EMAIL_HOST;
    let emailPort = process.env.EMAIL_PORT;

    if (_.isEmpty(emailHost)) {
      emailHost = 'localhost';
    }

    if (_.isEmpty(emailPort)) {
      emailPort = 1025;
    }

      // TODO: Handle devtest/prod setup here
    const transporter = nm.createTransport({

          // - Non-secure Settings
      host: emailHost,
      port: emailPort,
      secure: false,
      tls: { rejectUnauthorized: false },

          // - Secure Settings
          // port: 465,
          // secure: true,
          // auth: {
          //     user: 'username',
          //     pass: 'userpass'
          // }
    });

      // setup email data with unicode symbols
    const mailOptions = {
      from: '"🐱 Admin 🐱" <admin@admin.com>',
      to: toAddress,
      subject,
      text: textEmail,
      html: htmlEmail,
    };

    const id = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return logger.debug(error);
      }
      return info.response.split('250 Message queued as ')[1];
    });
    resolve(id);
  } catch (err) {
    reject(err);
  }
});

module.exports = {
  checkConnectionToServer,
  sendEmail,
};
