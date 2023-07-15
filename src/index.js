const log = require('./logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const SWARM_SIZE = +process.env.SWARM_SIZE || 20
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('base64');
}
