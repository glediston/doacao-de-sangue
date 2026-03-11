
//user.js
const userData = JSON.parse(localStorage.getItem("user"));

document.getElementById("welcomeUser").innerText =
  `Olá, ${userData.name}!`;