var kickClient = require('../actions/control/kickClient')

var alertClients = require('../actions/alert/alertClients')
var errorAlert = require('../actions/alert/errorAlert')

var sendMessage = require('../actions/messages/sendMessage')

module.exports = function (wss, client, username, data) {

    var type = data.type;
    
    console.log(username);

    if (!type) return;

    if (type == "alert") {      
      alertClients(wss, data.from, data.message)

    } else if (type == "kick") {
      kickClient(wss, data.from, data.id)

    } else if (type == "msg") {
      sendMessage(wss, username, data.message);

    } else {
      errorAlert(client);
    }
}