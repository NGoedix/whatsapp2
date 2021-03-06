const server = require('../../newserver');
const mysql = require('mysql');
var crypt = require('../crypt');
var jwt = require('jsonwebtoken');
const SQLControl = require('../connection/connection')
require('dotenv').config();

const sendLogin = require('../messages/sendLogin');

module.exports = function (wss, client, data, id) {


    let user = crypt.encode(data.user);

    SQLControl.connection.query('SELECT * FROM usuario WHERE nombreUsuario = ' + mysql.escape(user.toLowerCase()) + ' LIMIT 1', async (err, [result]) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                let msg = JSON.stringify({from: 'server', message: 'internal error', type: 'alert'})
                client.send(msg);
                return;
            }
        }
        if (result.length == 0) {
            client.send(JSON.stringify({from: 'server', message: 'La cuenta no existe.', type: 'alert'}))
            return;
        } else {
            let isSame = await crypt.comparePassword(data.password, result.password);

            if (isSame == true) {
                var token = jwt.sign({ id: result.idUsuario, username: crypt.decode(user) }, process.env.PRIVATE_KEY, { expiresIn: '24h' });

                let msg = JSON.stringify({from: 'server', id: result.idUsuario, user: crypt.decode(user), token: token, type: 'logged'})
                client.send(msg);
                server.addUser(client, result.idUsuario, crypt.decode(result.nombreUsuario));
                sendLogin(wss, crypt.decode(user), id);
            } else {
                let msg = JSON.stringify({from: 'server', message: 'Usuario o contraseña incorrectos', type: 'alert'})
                client.send(msg);
            }
        }
    });
}