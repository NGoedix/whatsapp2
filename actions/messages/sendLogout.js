const send = require("./send")

module.exports = function (clients, id, username) {
    message = JSON.stringify({from: username, id: id, type: "logout"})
    send(clients, message)
}