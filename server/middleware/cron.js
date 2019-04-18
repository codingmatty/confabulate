const { Router } = require('express');
const moment = require('moment');
const groupBy = require('lodash/groupBy');
const sendEmail = require('../email/send');

module.exports = function registerApi({ db, dev }) {
  const router = new Router();

  router.use((req, res, next) => {
    if (dev || req.query.secret === process.env.CRON_SECRET) {
      next();
      return;
    }
    res.status(400).end();
  });

  router.get('/daily-birthdays', async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('Host')}`;
    await sendDailyBirthdayEmails({ baseUrl, db });
    // Check in with Honeybedger
    await fetch(process.env.HONEYBADGER_CHECKIN_URL_DAILY_BIRTHDAYS);
    res.status(200).end();
  });

  return router;
};

async function sendDailyBirthdayEmails({ baseUrl, db }) {
  const today = moment();
  // User Model directly to bypass need for a user id
  const dbContacts = await db.Contacts.model.find({
    'birthday.month': today.month(),
    'birthday.day': today.date()
  });

  const contactsByOwnerId = groupBy(
    dbContacts.map((contact) => ({
      ownerId: contact.ownerId,
      name: contact.name,
      age:
        contact.birthday.year &&
        `${today.year() - contact.birthday.year} years`,
      url: `${baseUrl}/contacts/${contact.id}`
    })),
    'ownerId'
  );

  const users = await Promise.all(
    Object.keys(contactsByOwnerId).map((ownerId) => db.Users.get(ownerId))
  );

  return Promise.all(
    users
      .filter((user) => user) // protect against invalid users
      .map((user) => {
        const contacts = contactsByOwnerId[user.id];
        return sendEmail({
          receiver: {
            name: user.profile.name,
            email: user.email
          },
          template: 'daily-birthdays',
          data: {
            baseUrl,
            currentDate: today.format('MMMM D, YYYY'),
            contacts
          }
        });
      })
  );
}
