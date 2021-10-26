const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = 'src/index.html';

const server = express()
  .use(express.static(__dirname + '/src'))
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

let users = [];

var id = 0;

wss.on('connection', (ws, username, localId) => {

  console.log('[ + ] Se ha conectado un cliente.');


  for(var i = 0; i < users.length; i++) {
    var message = JSON.stringify({from: JSON.parse(users[i]).username, message: "", type: "logged"})
    ws.send(message);
  }


  ws.on('close', () => {
    userData = JSON.stringify({client: ws, id: localId, username: username})

    for(var i = 0; i < users.length; i++) {
      if (JSON.parse(users[i]).id == localId) {
        users.splice(i, 1)
      }
    }

    message = JSON.stringify({from: username, id:localId, type: "logout"})
    sendMessage(message);

    console.log('[ - ] Se ha desconectado un cliente :(');    
  });

  ws.onmessage = function (event) {

    if(event.data == 1) return;

    var data = JSON.parse(event.data);
    var type = data.type;
    if (!type) return;

    if (type == "alert") {

      if (data.from != "Goedix") return;

      var message = JSON.stringify({from: data.from, message: data.message, type: type})
      sendMessage(message)

    } else if (type == "kick") {
      //Tengo que cambiar el login para que se identifique a los usuarios bien.

    } else if (type == "login") {
      username = (data.from).replace(/<[^>]+>/g, '');

      localId = id;
      id++;

      userData = JSON.stringify({client: ws, id: localId, username: username})  
      users.push(userData);

      console.log(username + " tiene de id: " + localId)

      var message = JSON.stringify({from: username, id: localId, type: "logged"})
      sendMessage(message);

    } else if (type == "msg" && (data.from).toLowerCase() != "server") {


      var cleanText = (data.message).replace(/<[^>]+>/g, '');
      if (cleanText.trim() == '') return;

      var message = JSON.stringify({from: username, message: cleanText, type: type})
      sendMessage(message);
      
    } else {
      //En caso de que haya algún error se le manda al propio cliente un mensaje.
      var message = JSON.stringify({from: "server", message: "Ha habido un problema con tu solicitud.", type: "error"})
      ws.send(message);
    }
  }
});

function sendMessage(msg) {
  //Mandamos el mensaje a todos los clientes.
  wss.clients.forEach((client) => {
    client.send(msg);
  });
}