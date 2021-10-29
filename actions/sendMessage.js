var send = require('./send')
var escape = require('escape-html');

module.exports = function(clients, user, message) {
    //Escape HTML && Verify if the message contains only spaces
    var escapedMsg = escape(message);
    if (escapedMsg.trim() == '') return;
    
    //Render the message with markdown && construct the JSON message
    var result = md.render(escapedMsg);
    var message = JSON.stringify({from: user, message: result, type: "msg"})

    //Send the message to all clients
    send(clients, message)
}