var kickClient = require('../actions/control/kickClient')

var alertClients = require('../actions/alert/alertClients')
var errorAlert = require('../actions/alert/errorAlert')

var sendMessage = require('../actions/messages/sendMessage')

var register = require('../actions/users/register')
var login = require('./users/login')

var validToken = require('./control/validToken')

var jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = function (wss, client, data) {

  let type = data.type;
  let id = data.id;
  let token = data.token;
  if (!type) return;

  let isSame = token && data.from == jwt.verify(token, process.env.PRIVATE_KEY).username;
  
  if (type == 'alert') { // { from: "goedix123", message: message, type: "alert" }
    if (!isSame) return;
    alertClients(wss, data.from, data.message)

  } else if (type == 'kick') { // { from: "goedix123", id: userId, type: "kick" }
    if (!isSame) return;
    kickClient(wss, data.from, id)

  } else if (type == 'msg') { // { from: user, message: message, type: "msg" }
    if (!isSame) return;
    sendMessage(wss, data.from, data.message);

  } else if (type == 'register') {
    register(wss, client, data.message);

  } else if (type == 'logToken') {
    validToken(wss, client, data.from, data.token);

  } else if (type == 'login') {
    login(wss, client, data.message, id);

  } else {
    errorAlert(client); // Send error if not match correct type
  }
}