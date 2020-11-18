const log4js = require('log4js');
const config = require('./config.js');

const env = config.get('logLevel');

log4js.configure('./config/log4js.json');

const self = {
  getLogger: (name) => {
    const logger = log4js.getLogger(name);
    return logger;
  },
};

module.exports = self;
