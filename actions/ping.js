const send = require("./send")

module.exports = function (clients) {
    //Send ping to all clients to prevent timeout disconnect
    send(clients, 1)
}