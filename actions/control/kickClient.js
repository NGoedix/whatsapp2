module.exports = function (wss, from, id) {
    if(from != "Goedix") return;

    counter = 0;
    var kicked = false;
    wss.clients.forEach((client) => {
      if (counter == id && kicked == false) {
        client.send(JSON.stringify({from: "Goedix", message: "Has sido expulsado.", type: "alert"}))
        client.close();
        kicked = true;
        return;
      }
      counter++;
    });
}