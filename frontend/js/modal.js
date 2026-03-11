
//modal.js
function openModal(type) {
  if (type === "login") {
    document.getElementById("loginModal").style.display = "flex";
  }

  if (type === "register") {
    document.getElementById("registerModal").style.display = "flex";
  }
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("registerModal").style.display = "none";
}