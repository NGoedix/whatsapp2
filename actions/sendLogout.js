const send = require("./send")

module.exports = function (clients, username, id) {
    message = JSON.stringify({from: username, id:id, type: "logout"})
    send(clients, message)
}