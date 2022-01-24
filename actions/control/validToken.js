const jwt = require('jsonwebtoken');
const server = require('../../newserver');
const sendLogin = require('../messages/sendLogin');
require('dotenv').config();

module.exports = function (wss, client, username, token) {
  let id = jwt.verify(token, process.env.PRIVATE_KEY).id;
  sendLogin(wss, username, id);
  server.addUser(client, id, username)
  return
}