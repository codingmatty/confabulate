module.exports = {
  mongodbMemoryServerOptions: {
    autoStart: false,
    binary: {
      skipMD5: true,
      version: '4.0.9'
    },
    instance: {
      dbName: 'confabulate_test'
    }
  }
};
