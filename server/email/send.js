const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const mjml2html = require('mjml');
const Handlebars = require('handlebars');
const logger = require('../logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getFileContents = (filename) =>
  new Promise((resolve, reject) =>
    fs.readFile(path.resolve(filename), { encoding: 'utf8' }, (err, output) =>
      err ? reject(err) : resolve(output)
    )
  );

const TEMPLATE_SUBJECTS = {
  ['daily-birthdays']: 'Daily Birthdays'
};
const VALID_TEMPLATES = Object.keys(TEMPLATE_SUBJECTS);

module.exports = async function send({ receiver, template, data }) {
  if (!VALID_TEMPLATES.includes(template)) {
    throw new Error('Invalid Email Template');
  }

  const templateContent = await getFileContents(
    `${__dirname}/templates/${template}.mjml.hbs`
  );
  const mjmlMarkup = Handlebars.compile(templateContent)(data);
  const { html, errors } = mjml2html(mjmlMarkup);

  if (!errors.length) {
    const emailData = {
      to: {
        name: receiver.name,
        email: receiver.email
      },
      from: {
        name: 'Confabulate',
        email: 'no-reply@confabulate.co'
      },
      subject: TEMPLATE_SUBJECTS[template],
      html
    };
    logger.info('Sending Email', { emailData });
    sgMail.send(emailData);
  } else {
    logger.error('Email Markup Generation Errors', { errors });
  }
};
