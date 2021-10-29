const send = require("../messages/send");

module.exports = function (clients, from, alert) {
    if (from != "goedix123") return;

    var message = JSON.stringify({from: username, message: alert, type: "alert"})
    send(clients, message)
}