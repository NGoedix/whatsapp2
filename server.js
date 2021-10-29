const express = require('express');
const { Server } = require('ws');

var MarkdownIt = require('markdown-it');
md = new MarkdownIt();

const ping = require('./actions/ping');
const sendLogout = require('./actions/messages/sendLogout');
const messageHandler = require('./actions/messageHandler');
const sendLogin = require('./actions/messages/sendLogin');

const PORT = process.env.PORT || 3000;
const INDEX = 'src/index.html';

const server = express()
  .use(express.static(__dirname + '/src'))
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

//Identifaction of users
let users = [];
var id = 0;
var blockLogin = false;

wss.on('connection', (ws, username, localId) => {

  if (blockLogin) {
    ws.send(JSON.stringify({from: "server", message: "El login está desactivado.", type: "alert"}))
    ws.close();
  }

  console.log('[ + ] Se ha conectado un cliente.');

  localId = id;
  id++;

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

    sendLogout(wss, username, localId)
    console.log('[ - ] Se ha desconectado un cliente :(');    
  });

  ws.onmessage = function (event) {

    data = JSON.parse(event.data)
    type = data.type

    if (type == "login") {
      //Escape HTML
      username = data.from.replace(/<[^>]+>/g, '');
      username = data.from.replace(/<\//g, '')
      console.log(username)

      if (username.trim() == "") {
        ws.send(JSON.stringify({from: "server", message: "No puedes entrar con un username vacío.", type: "alert"}))
        ws.close()
      }

      //Add user to the Users Connected JSON
      userData = JSON.stringify({client: ws, id: localId, username: username})  
      users.push(userData);
      
      sendLogin(wss, username, localId);
      return;
    } else if (type == "blockLogin" && data.from == "goedix123") {
      blockLogin = !blockLogin;
      return;
    } else {
      messageHandler(wss, ws, username, JSON.parse(event.data));
    }
  }
});

setInterval(() => {
  ping(wss);
}, 2000);