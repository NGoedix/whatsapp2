let HOST = location.origin.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);
let localId;

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

ws.onmessage = (event) => {

    // Get the data in JSON
    var data = JSON.parse(event.data);

    // Ping to evit timeout disconnect
    if(data == 1) return;

    // Get the type of the socket message
    var type = data.type;

    // Check the type
    if (type == "alert") {
        if (data.message == "Te has registrado correctamente.") hideAll();
        alert(data.message);
        return;

    } else if(type == "error" && data.from == "server") {
        alert("Error: " + data.message);
        return;
      
    } else if (type == "registered" && data.from == "server") {
        setCookie('token', data.token, 1);
        setCookie('user', data.user, 1)
        setCookie('id', data.id, 1)
        hideAll();
        setUser(data.user);
        return;

    } else if (type == 'logged' && data.from == 'server') {
        setCookie('token', data.token, 1);
        setCookie('user', data.user, 1)
        setCookie('id', data.id, 1)
        hideAll();
        setUser(data.user);
        return;

    } else if (type == 'loggedUser') {
        var userId = data.id;
        var fromUser = data.from;

        // If the scrollbar is at the bottom of the chat-content then autoscroll
        var scrollbar = document.getElementById('chat-content');
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;

        // Add user to the list and into the chat
        $('#userList').append('<div class="userInList" id="user-' + userId + '"><img src="icons/user.png" width="64" height="64"><span>' + fromUser + '</span></div>');
        $('#chat-content').append('<div id="chat-log"><p>' + fromUser + ' se ha conectado.</p></div>');
        if (scroll) Autoscroll();
        return;
    
    } else if (type == "usersLogged") { // TODO CHANGE TO ARRAY OF USERS
        let users = data.users;

        for (let i = 0; i < users.length; i++) {
            // If the scrollbar is at the bottom of the chat-content then autoscroll
            var scrollbar = document.getElementById('chat-content');
            var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;

            // Add user to the list and into the chat
            $('#userList').append('<div class="userInList" id="user-' + JSON.parse(users[i]).id + '"><img src="icons/user.png" width="64" height="64"><span>' + JSON.parse(users[i]).username + '</span></div>');
            $('#chat-content').append('<div id="chat-log"><p>' + JSON.parse(users[i]).username + ' se ha conectado.</p></div>');
            if (scroll) Autoscroll();
        }
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
        var messageFrom = (data.from).toLowerCase() == getCookie('user').toLowerCase() ? "message-me" : "message-external";

        var scrollbar = document.getElementById('chat-content');

        // Put the message
        var scroll = scrollbar.scrollTop == scrollbar.scrollTopMax ? true : false;
        $('#chat-content').append('<div id="' + messageFrom + '"><p id="' + messageFrom + '-name"> ' + fromUser + ' </p><div id="' + messageFrom + '-content">' + data.message + '</div></div>');
        if(scroll) Autoscroll();
    }   
};

// Function to send messages
function sendMessage() {
    if (getCookie('user') == '') return;

    var input = $('#messageArea').val();

    if(input.trim() != '') {
        var msg = JSON.stringify({from: getCookie('user'), token: getCookie('token'), message: input, type: "msg"})
        ws.send(msg);
        $('#messageArea').val('');
    } else {
        // If the messageArea contain only spaces this will return no-spaces.
        $('#messageArea').val('');
    }
}

function registerUser() {
    let usernameInput = $('#usernameRegister').val();
    let nameInput = $('#nameRegister').val();
    let passwordInput = $('#passwordRegister').val();

    if(passwordInput.trim() != '' && usernameInput.trim() != '' && passwordInput.trim() != ''
        && passwordInput.length > 8 && usernameInput.length > 3 && nameInput.length > 2) {
        let msg = JSON.stringify({message: {user: usernameInput, name: nameInput, password: passwordInput}, type: "register"});
        ws.send(msg);
        $('#usernameRegister').val('');
        $('#nameRegister').val('');
        $('#passwordRegister').val('');
    } else {
        if (passwordInput.length <= 8) {
            alert('La contraseña debe tener más de 8 carácteres.')
        } else if (usernameInput.length <= 3) {
            alert('El nombre de usuario debe tener más de 3 carácteres.')
        } else if (nameInput.length <= 2) {
            alert('Los nombres deben tener más de 2 carácteres.')
        } else {
            alert('Las entradas no pueden contener espacios.');
        }
    }
}

function loginUser() {
    let usernameInput = $('#usernameLogin').val();
    let passwordInput = $('#passwordLogin').val();

    if (usernameInput.trim() != '' && passwordInput.trim() != '') {
        let msg = JSON.stringify({message: {user: usernameInput, password: passwordInput}, type: 'login'})
        ws.send(msg);
    } else {
        alert("Debes escribir el usuario y la contraseña.")
    }
}

function Autoscroll() {
    var scrollbar = document.getElementById('chat-content');
    scrollbar.scrollTop = scrollbar.scrollHeight;
}

// Enter = Send Message && Shift enter = Skip line
$(function() {
    $("#messageArea").keypress(function(event) {
      //var keycode = (event.keyCode ? event.keyCode : event.which);
    
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

function setUser(username) {
    $('#logBtn').html('<button id="usernameBtn" class="btn btn-outline-primary">' + username + '</button>');
}