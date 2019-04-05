const { Router } = require('express');
const moment = require('moment');
const groupBy = require('lodash/groupBy');
const sendEmail = require('../email/send');

module.exports = function registerApi({ db, dev }) {
  const router = new Router();

  router.use((req, res, next) => {
    if (dev || req.get('X-Appengine-Cron')) {
      next();
      return;
    }
    res.status(400).end();
  });

  router.get('/daily-birthdays', async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('Host')}`;
    await sendDailyBirthdayEmails({ baseUrl, db });
    res.status(200).end();
  });

  return router;
};

async function sendDailyBirthdayEmails({ baseUrl, db }) {
  const today = moment();
  const dbContacts = await db.Contacts.query({
    'birthday.month': today.month(),
    'birthday.day': today.date()
  });

  const contactsByUserId = groupBy(
    dbContacts.map((contact) => ({
      userId: contact.userId,
      fullName: contact.fullName,
      age:
        contact.birthday.year &&
        `${today.year() - contact.birthday.year} years`,
      url: `${baseUrl}/contacts/${contact.id}`
    })),
    'userId'
  );

  const users = await Promise.all(
    Object.keys(contactsByUserId).map((userId) => db.Users.get(userId))
  );

  return Promise.all(
    users
      .filter((user) => user) // protect against invalid users
      .map((user) => {
        const contacts = contactsByUserId[user.id];
        return sendEmail({
          receiver: {
            fullName: user.profile.fullName,
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
