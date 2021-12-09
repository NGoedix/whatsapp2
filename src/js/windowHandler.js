var texto = "Bienvenidos a esta humilde aplicación de mensajería desarrollada por Diego para el curso de DAM 1. El objetivo de esta aplicación es tener una vía de comunicación en tiempo real con funciones nuevas.";
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

var tienesCuenta = document.getElementById("doYouHaveAcc");
var noTienesCuenta = document.getElementById("notDoYouHaveAcc");

// When the user clicks the button, open the modal 
btnRegister.onclick = () => {
  panelContainer.style.display = "block";
  panelMain.style.display = "block";
  panelRegister.style.display = "block";
  
  // Begin the machine effect letter.
  $('#typer').html('')
  maquina("typer", texto, 100, 0);
  return;
}

tienesCuenta.onclick = () => {
  panelRegister.style.display = "none";
  panelLogin.style.display = "block";
}

noTienesCuenta.onclick = () => {
  panelLogin.style.display = "none";
  panelRegister.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == panelContainer) {
    panelContainer.style.display = "none";
    panelMain.style.display = "none";
    panelLogin.style.display = "none";
    panelRegister.style.display = "none";
  }
}