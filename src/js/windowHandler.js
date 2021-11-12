var texto = "Bienvenidos a esta humilde aplicación de mensajería desarrollada por Goedix para el curso de DAM 1. El objetivo de esta aplicación es tener una vía de comunicación en tiempo real con funciones nuevas.";
// Panel's list
var panelMain = document.getElementById("panel");
var panelContainer = document.getElementById("panel-container");

var panelLogin = document.getElementById("panelLogin");
var panelRegister = document.getElementById("panelRegister");
var panelPass = document.getElementById("panelPass");
var panelShop = document.getElementById("panelShop");

// Button's list to show the panels
var btnLogin = document.getElementById("navLoginButton");
var btnRegister = document.getElementById("navRegisterButton");
var btnShop = document.getElementById("navShopButton");
var btnProfile = document.getElementById("navProfileButton");

// Button to close the panels
//var closePanel = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btnShop.onclick = function() {
  panelContainer.style.display = "block";
  panelMain.style.display = "block";
  panelLogin.style.display = "block";
  
  // Begin the machine effect letter.
  $('#typer').html('')
  maquina("typer",texto, 100, 0);
  return;
}

// When the user clicks on <span> (x), close the modal
/*closePanel.onclick = function() {
  panelLogin.style.display = "none";
}*/

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == panelContainer) {
    panelContainer.style.display = "none";
    panelMain.style.display = "none";
    panelLogin.style.display = "none";
  }
}