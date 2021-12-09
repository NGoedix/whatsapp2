const mysql = require('mysql');

module.exports = function (wss, client, username, data) {
    
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "whatsup"
    });
  
    con.connect(function(err) {
        if (err) throw err;
    });


}