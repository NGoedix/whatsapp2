const express = require('express');
const { Server } = require('ws');

var MarkdownIt = require('markdown-it');
md = new MarkdownIt();

const sendMessage = require('./actions/sendMessage')
const ping = require('./actions/ping');
const kickClient = require('./actions/kickClient');
const sendLogin = require('./actions/sendLogin')
const alertClients = require('./actions/alertClients');
const errorAlert = require('./actions/errorAlert');
const sendLogout = require('./actions/sendLogout');

var escape = require('escape-html');

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

wss.on('connection', (ws, username, localId) => {

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
    var data = JSON.parse(event.data);
    var type = data.type;

    if (!type) return;

    if (type == "alert") {      
      alertClients(wss, data.from, data.message)

    } else if (type == "kick") {
      kickClient(wss, data.from, data.id)

    } else if (type == "login") {
      //Escape HTML
      username = escape(data.from);

      //Add user to the Users Connected JSON
      userData = JSON.stringify({client: ws, id: localId, username: username})  
      users.push(userData);
      
      sendLogin(wss, username, localId);

    } else if (type == "msg" && (username).toLowerCase() != "server") {
      sendMessage(wss, username, data.message)

    } else {
      errorAlert(ws)

    }
  }
});

setInterval(() => {
  ping(wss);
}, 2000);