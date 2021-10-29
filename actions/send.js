module.exports = function (wss, message) {
    //Send any message to all clients
    wss.clients.forEach((client) => {
        client.send(message);
    });
}