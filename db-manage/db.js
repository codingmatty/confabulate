require('../server/setup-env-vars');
const initDatabase = require('../server/db');

const developmentMongoUrl = 'mongodb://localhost:27018/confabulate_development';

module.exports = initDatabase(process.env.MONGO_URL || developmentMongoUrl);
