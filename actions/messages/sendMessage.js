var send = require('./send')
var escape = require('escape-html');

module.exports = function(clients, user, message) {    
    //Render the message with markdown && verify if the message is null && construct the JSON message
    var result = md.render(message);
    if (result.trim() == '') return;

    var message = JSON.stringify({from: user, message: result, type: "msg"})

    //Send the message to all clients
    send(clients, message)
}