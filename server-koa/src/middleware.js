
'use strict';

const middlewareDir = './middleware/'

module.exports = {
  xResponseTime: require(`${middlewareDir}x-response-time`),
  logger: require(`${middlewareDir}logger`)
};

