
'use strict';

const routersDir = './routers/'

module.exports = {
  users: require(`${routersDir}users`),
  items: require(`${routersDir}items`),
  categories: require(`${routersDir}categories`)
};