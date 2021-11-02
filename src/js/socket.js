let HOST = location.origin.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);
let localId;

ws.onmessage = (event) => {
    var data = JSON.parse(event.data);

    if(data == 1) return;

    var type = data.type;

    if (type == "alert") {
        alert(data.message);
        return;
    } else if(type == "error" && data.from == "server") {
        alert("Error: " + data.message);
        return;
      
    } else if(type == "logged") {
        var userId = data.id;
        var fromUser = data.from.length > 25 ? (data.from).substr(0, 25) + "..." : data.from;

        var scrollbar = document.getElementById('chat-content');
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;

        $('#userList').append('<div class="userInList" id="user-' + userId + '"><img src="icons/user.png" width="64" height="64"><span>' + fromUser + '</span></div>');
        $('#chat-content').append('<div id="chat-log"><p>' + fromUser + ' se ha conectado.</p></div>');
        if (scroll) Autoscroll();
        return;
      
    } else if (type == "logout") {

        var userId = data.id;
        var fromUser = data.from.length > 25 ? (data.from).substr(0, 25) + "..." : data.from;
        
        //Auto Scroll
        var scrollbar = document.getElementById('chat-content');
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;

        $('#userList').children('#user-' + userId)[0].remove();
        $('#chat-content').append('<div id="chat-log"><p>' + fromUser + ' se ha desconectado :(</p></div>');

        if(scroll) Autoscroll();
        return;

    } else {
        //Mensaje normal
        var fromUser = data.from.length > 25 ? (data.from).substr(0, 25) + "..." : data.from;
        console.log(fromUser + "\n" + user)
        var messageFrom = (data.from).toLowerCase() == user.toLowerCase() ? "message-me" : "message-external";

        var scrollbar = document.getElementById('chat-content');

        //Colocar mensaje
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;
        var content = $('#chat-content').append('<div id="' + messageFrom + '"><p id="' + messageFrom + '-name"> ' + fromUser + ' </p><div id="' + messageFrom + '-content">' + data.message + '</div></div>');
        if(scroll) Autoscroll();
    }   
};

//Función al enviar mensajes.
function sendMessage() {
var input = $('#messageArea').val();
var typeMsg = "msg";
var originalMsg = '';

if(input.trim() != '') {
    //Checkeamos que tipo de mensaje es | Validado también en backend
    if(input.search("#alert") == 0) {
        typeMsg = "alert";
        originalMsg = input.substr(6);
        var msg = JSON.stringify({from: user, message: originalMsg, type: typeMsg})
        } else if (input.search("#kick") == 0) {
        typeMsg = "kick";
        originalMsg = input.substr(5);
        var msg = JSON.stringify({from: user, id: input.substr(6), type: "kick"})
        } else if (input.search("#blockLogin") == 0) {
        typeMsg = "blockLogin"
        var msg = JSON.stringify({from: user, type: typeMsg})
        } else {
        typeMsg = "msg";
        originalMsg = input;
        var msg = JSON.stringify({from: user, message: originalMsg, type: typeMsg})
        }
        //ZAvk3n4NW5
        ws.send(msg);
        $('#messageArea').val('');
    } else {
        //En caso de que el mensaje contenga espacios se vacía el cuadro.
        $('#messageArea').val('');
    }
}

function Autoscroll() {
    var scrollbar = document.getElementById('chat-content');
    scrollbar.scrollTop = scrollbar.scrollHeight;
}

//Enter = Enviar mensaje && Shift enter = Salto de linea
$(function() {
    $("#messageArea").keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
    
      if ((event.keyCode == 13 || event.keyCode == 10) && event.shiftKey) {
        var value = $('#messageArea').val();
        $('#messageArea').val(value + "\n");
        return false;
      } else if (event.keyCode == 13 || event.keyCode == 10) {
        sendMessage();
        return false;
      }
    });
  })