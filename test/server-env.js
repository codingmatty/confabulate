// https://itnext.io/parallel-testing-a-graphql-server-with-jest-44e206f3e7d2
const NodeEnvironment = require('jest-environment-node');
const MongodbMemoryServer = require('mongodb-memory-server');

class MongoDbEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    // eslint-disable-next-line new-cap
    this.mongod = new MongodbMemoryServer.default({
      instance: {
        // settings here
        // dbName is null, so it's random
        // dbName: MONGO_DB_NAME,
      },
      binary: {
        version: '4.0.9'
      }
    });
  }

  async setup() {
    await super.setup();
    // console.log('\n# MongoDB Environment Setup #');

    this.global.__MONGO_URI__ = await this.mongod.getConnectionString();
    this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName();
    // this is used to have different names for documents created while testing
    this.global.__COUNTERS__ = {
      user: 0
    };
  }

  async teardown() {
    // console.log('\n# MongoDB Environment Teardown #');
    await super.teardown();
    await this.mongod.stop();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoDbEnvironment;
