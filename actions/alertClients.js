const send = require("./send");

module.exports = function (clients, from, alert) {
    if (from != "Goedix") return;

    var message = JSON.stringify({from: username, message: alert, type: "alert"})
    send(clients, message)
}