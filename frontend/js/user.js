

// user.js
document.addEventListener("DOMContentLoaded", () => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        const welcomeElement = document.getElementById("welcomeUser");
        
        if (welcomeElement) {
            welcomeElement.innerText = `Olá, ${userData.name}!`;
        }
    }
});