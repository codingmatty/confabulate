require('../server/setup-env-vars');
require('../server/db');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const Migrations = mongoose.model(
  'Migration',
  new Schema({
    lastRun: String,
    migrations: [
      {
        title: String,
        timestamp: Number
      }
    ]
  })
);

module.exports = class Store {
  async load(next) {
    try {
      const load = await Migrations.findOne({});
      if (load) {
        next(null, load);
      } else {
        next(null, {
          lastRun: null,
          migrations: []
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async save(set, next) {
    try {
      const result = await Migrations.findOneAndUpdate(
        {},
        {
          lastRun: set.lastRun,
          $push: {
            migrations: {
              $each: set.migrations.map(({ title, timestamp }) => ({
                title,
                timestamp
              }))
            }
          }
        },
        { upsert: true }
      );
      next(null, result);
    } catch (error) {
      next(error);
    }
  }
};
