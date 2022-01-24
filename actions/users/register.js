const server = require('../../newserver');
const mysql = require('mysql');
const SQLControl = require('../connection/connection')
var crypt = require('../crypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const sendLogin = require('../messages/sendLogin');

module.exports = async function (wss, client, data) {

    if (!(/[a-zA-Z\d._-]/.test(data.user))) {
        let msg = JSON.stringify({from: 'server', message: 'El nombre de usuario no cumple con los requisitos', type: 'alert'})
        client.send(msg);
        return;
    }

    let hash = await crypt.hashPassword(data.password);
    
    let sql = `INSERT INTO usuario (nombreUsuario, nombre, password) VALUES ?`;
    let values = [[(data.user).toLowerCase(), data.name, hash]]
    SQLControl.connection.query(sql, [values], function (err) {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                let msg = JSON.stringify({from: 'server', message: 'internal error', type: 'alert'})
                client.send(msg);
                return;
            } else if (err.code === 'ER_DUP_ENTRY') {
                let msg = JSON.stringify({from: 'server', message: 'Ese nombre de usuario no está disponible', type: 'alert'})
                client.send(msg);
                return;
            } else {
                console.error(err)
            }
        }
        let sql = `SELECT idUsuario, nombreUsuario FROM usuario WHERE nombreUsuario = ` + mysql.escape((data.user).toLowerCase()) + ` LIMIT 1`;
        SQLControl.connection.query(sql, (err, [result]) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    let msg = JSON.stringify({from: 'server', message: 'internal error', type: 'alert'})
                    client.send(msg);
                    return;
                }
            }

            var token = jwt.sign({ id: result.idUsuario, username: data.user }, process.env.PRIVATE_KEY, { expiresIn: '24h' });

            let message = JSON.stringify({from: 'server', id: result.idUsuario, user: data.user, token: token, type: 'registered'})
            client.send(message);
            sendLogin(wss, data.user, result.idUsuario);
            server.addUser(client, result.idUsuario, result.nombreUsuario);

        })
    });
}