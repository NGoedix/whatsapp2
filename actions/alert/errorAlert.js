module.exports = function (client) {
    //Make the message && Send
    var message = JSON.stringify({from: "server", message: "Ha habido un problema con tu solicitud.", type: "error"})
    client.send(message);
}