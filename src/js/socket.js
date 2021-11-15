let HOST = location.origin.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);
let localId;

ws.onmessage = (event) => {

    // Get the data in JSON
    var data = JSON.parse(event.data);

    // Ping to evit timeout disconnect
    if(data == 1) return;

    // Get the type of the socket message
    var type = data.type;

    // Check the type
    if (type == "alert") {
        alert(data.message);
        return;
    } else if(type == "error" && data.from == "server") {
        alert("Error: " + data.message);
        return;
      
    } else if(type == "logged") {
        var userId = data.id;
        var fromUser = data.from.length > 20 ? (data.from).substr(0, 20) + "..." : data.from;

        // If the scrollbar is at the bottom of the chat-content then autoscroll
        var scrollbar = document.getElementById('chat-content');
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;

        // Add user to the list and into the chat
        $('#userList').append('<div class="userInList" id="user-' + userId + '"><img src="icons/user.png" width="64" height="64"><span>' + fromUser + '</span></div>');
        $('#chat-content').append('<div id="chat-log"><p>' + fromUser + ' se ha conectado.</p></div>');
        if (scroll) Autoscroll();
        return;
      
    } else if (type == "logout") {

        var userId = data.id;
        var fromUser = data.from.length > 20 ? (data.from).substr(0, 20) + "..." : data.from;
        
        // If the scrollbar is at the bottom of the chat-content then autoscroll
        var scrollbar = document.getElementById('chat-content');
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;

        $('#userList').children('#user-' + userId)[0].remove();
        $('#chat-content').append('<div id="chat-log"><p>' + fromUser + ' se ha desconectado :(</p></div>');

        if(scroll) Autoscroll();
        return;

    } else {
        // Normal message
        var fromUser = data.from.length > 25 ? (data.from).substr(0, 25) + "..." : data.from;
        var messageFrom = (data.from).toLowerCase() == user.toLowerCase() ? "message-me" : "message-external";

        var scrollbar = document.getElementById('chat-content');

        // Put the message
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;
        var content = $('#chat-content').append('<div id="' + messageFrom + '"><p id="' + messageFrom + '-name"> ' + fromUser + ' </p><div id="' + messageFrom + '-content">' + data.message + '</div></div>');
        if(scroll) Autoscroll();
    }   
};

// Function to send messages
function sendMessage() {
    var input = $('#messageArea').val();

    if(input.trim() != '') {
        var msg = JSON.stringify({from: user, message: input, type: "msg"})
        // Password of database: ZAvk3n4NW5
        ws.send(msg);
        $('#messageArea').val('');
    } else {
        // If the messageArea contain only spaces this will return no-spaces.
        $('#messageArea').val('');
    }
}

function Autoscroll() {
    var scrollbar = document.getElementById('chat-content');
    scrollbar.scrollTop = scrollbar.scrollHeight;
}

// Enter = Send Message && Shift enter = Skip line
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