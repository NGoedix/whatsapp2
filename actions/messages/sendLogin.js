const send = require("./send")

module.exports = function (clients, user, id) {
    // Make the message
    var login = JSON.stringify({from: user, id: id, type: "loggedUser"})
    send(clients, login)
}