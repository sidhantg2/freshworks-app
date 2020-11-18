const convict = require('convict');
convict.addFormat(require('convict-format-with-validator').ipaddress);

const schema = {
  env: {
    doc: 'Applicaton environment',
    format: ['prod', 'staging', 'dev', 'test'],
    default: 'local',
    env: 'NODE_ENV',
  },
  logLevel: {
    doc: 'log level',
    default: "debug",
    format: String,
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: 'localhost',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
  }
};


const config = convict(schema);
const env = config.get('env');
config.loadFile(`./config/${env}.json`);
// config.validate({allowed: 'strict'});
module.exports = config;
