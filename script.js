const loginScreen = document.getElementById("loginScreen");
const homeScreen = document.getElementById("homeScreen");
 
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

/* Shows one screen, hides the other */

function showScreen(screenToShow) {
  [loginScreen, homeScreen].forEach((screen) => {
    screen.style.display = (screen === screenToShow) ? "block" : "none";
  });
}

/* Login -> Home */

loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // prevent page reload; validation can be added later
  showScreen(homeScreen);
});

/* Home -> Login (log out) */
logoutBtn.addEventListener("click", function () {
  showScreen(loginScreen);
});