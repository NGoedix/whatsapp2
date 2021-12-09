module.exports = function (wss, from, id) {

  console.log("ID TO KICK: " + id);
  console.log("FROM USER: " + from);

  if(from != "goedix123") return;

  counter = 0;
  var kicked = false;
  wss.clients.forEach((client) => {
    console.log(client);
    if (counter == id && kicked == false) {
      console.log("ID CONTADOR: " + id);
      console.log("Username: " + client)
      client.send(JSON.stringify({from: "Goedix", message: "Has sido expulsado.", type: "alert"}))
      client.close();
      kicked = true;
      return;
    }
    counter++;
  });
}