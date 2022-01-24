var mysql = require('mysql');

const connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "dWKPtIx5xt",
  port: 3306,
  password: "XJr9IcNrv5",
  database: "dWKPtIx5xt"
});

connection.connect((error) => {
  if (error) {
    console.log("[ - ] Fallo al conectar con la base de datos.")
    return;
  }
  console.log('[ + ] Conexión establecida con la base de datos.');
})

setInterval(function () {
  connection.query('SELECT 1');
}, 5000);

module.exports = { 
    connection, 
    mysql 
};