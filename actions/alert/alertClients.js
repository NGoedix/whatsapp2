const send = require("../messages/send");

module.exports = function (clients, username, alert) {
    if (username != "goedix123" || alert == undefined) return;

    var message = JSON.stringify({from: "Goedix", message: alert, type: "alert"})
    send(clients, message)
}