const express = require('express');
const { Server } = require('ws');

var MarkdownIt = require('markdown-it');
md = new MarkdownIt();

const ping = require('./actions/ping');
const sendLogout = require('./actions/messages/sendLogout');
const messageHandler = require('./actions/messageHandler');

const PORT = process.env.PORT || 3000;
const INDEX = 'src/index.html';
const server = express()
    .use(express.static(__dirname + '/src'))
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

// Users logs
let users = []; // {client: 'websocket object', id: 'database id', username: 'nombre de usuario'}

wss.on('connection', (ws) => {
  console.log('[ + ] Se ha conectado un cliente.');

  // Mandar un array de los usuarios logueados con su respectiva ID.
  let userListMsg = [];
  users.map((user) => userListMsg.push(JSON.stringify({id: user.id, username: user.username})));

  let msg = JSON.stringify({users: userListMsg, type: 'usersLogged'})
  ws.send(msg);

  ws.on('close', () => {
    // Cuando el usuario cierra la ventana.
    console.log('[ - ] Se ha desconectado un cliente.');  
    for(var i = 0; i < users.length; i++) {
      if (users[i].client == ws) {
        sendLogout(wss, users[i].id, users[i].username);
        users.splice(i, 1);
        return;
      }
    }
  });

  ws.onmessage = function (event) {
    // Guardamos el tipo de mensaje que es.
    data = JSON.parse(event.data);
    type = data.type;
    token = data.token;

    // En caso de que no esté logueando se llevará a un handler que decidirá que hacer.
    messageHandler(wss, ws, data);
  }
});

const addUser = (ws, id, username) => {
  userData = {client: ws, id: id, username: username}
  users.push(userData);
}

// Send ping to avoid timeout disconnection
setInterval(() => {
  ping(wss);
}, 10000);

module.exports.addUser = addUser;