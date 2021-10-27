const express = require('express');
const { Server } = require('ws');
var MarkdownIt = require('markdown-it'),

md = new MarkdownIt();

const PORT = process.env.PORT || 3000;
const INDEX = 'src/index.html';

const server = express()
  .use(express.static(__dirname + '/src'))
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

//Identificación de usuarios
let users = [];
var id = 0;


wss.on('connection', (ws, username, localId) => {

  localId = id;
  id++;

  //Conexión de clientes y update de clientes conectados.
  console.log('[ + ] Se ha conectado un cliente.');

  for(var i = 0; i < users.length; i++) {
    var message = JSON.stringify({from: JSON.parse(users[i]).username, id: JSON.parse(users[i]).id, type: "logged"})
    ws.send(message);
  }

  ws.on('close', () => {
    //Desconexión del usuario
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

    if (type == "alert") { // {from: username, id: objetiveID, type: kick}

      if (data.from != "Goedix") return;

      var message = JSON.stringify({from: data.from, message: data.message, type: type})
      sendMessage(message)

    } else if (type == "kick") { // {from: username, id: objetiveID, type: kick}
      
      if(data.from != "Goedix") return;

      //Buscamos el usuario a kickear y lo echamos.
      counter = 0;
      var kicked = false;
      wss.clients.forEach((client) => {
        if (counter == data.id && kicked == false) {
          client.send(JSON.stringify({from: "Goedix", message: "Has sido expulsado.", type: "alert"}))
          client.close();
          kicked = true;
          return;
        }
        counter++;
      });

    } else if (type == "login") {
      username = data.from
      username = username.replace(/<[^>]+>/g, '');
      username = username.replace(/<\//g, '')

      userData = JSON.stringify({client: ws, id: localId, username: username})  
      users.push(userData);

      var login = JSON.stringify({from: username, id: localId, type: "logged"})
      sendMessage(login);

    } else if (type == "msg" && (data.from).toLowerCase() != "server") {

      var cleanText = (data.message).replace(/<[^>]+>/g, '');
      cleanText = cleanText.replace(/<\//g, '')
      if (cleanText.trim() == '') return;
      
      var result = md.render(cleanText);
      var message = JSON.stringify({from: username, message: result, type: type})
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

setInterval(() => {
  sendMessage(1);
}, 1000);