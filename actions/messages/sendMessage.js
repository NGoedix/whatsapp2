var send = require('./send')

module.exports = function(clients, user, message) {    
    // Render the message with markdown && verify if the message is null && construct the JSON message
    // Check if the message contain markdown symbols and will send an empty message.
    if (message.trim() == '*' || message.trim() == '#' || message.trim() == '##' || message.trim() == '###' 
        || message.trim() == '####' || message.trim() == '#####' || message.trim() == '######') return;
    var result = md.render(message);
    if (result.trim() == '') return;

    var message = JSON.stringify({from: user, message: result, type: "msg"})

    // Send the message to all clients
    send(clients, message)
}