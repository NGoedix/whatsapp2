var kickClient = require('../actions/control/kickClient')

var alertClients = require('../actions/alert/alertClients')
var errorAlert = require('../actions/alert/errorAlert')

var sendMessage = require('../actions/messages/sendMessage')
var sendLogin = require('../actions/messages/sendLogin')

var escape = require('escape-html');

module.exports = function (wss, username, data) {

    var type = data.type;
    
    if (!type) return;

    if (type == "alert") {      
      alertClients(wss, data.from, data.message)

    } else if (type == "kick") {
      kickClient(wss, data.from, data.id)

    } else if (type == "msg" && (username).toLowerCase() != "server") {
      sendMessage(wss, username, data.message);

    } else {
      errorAlert(ws);
    }
}