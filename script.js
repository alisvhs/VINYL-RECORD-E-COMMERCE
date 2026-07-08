const loginScreen = document.getElementById("loginScreen");
const homeScreen = document.getElementById("homeScreen");
const cartScreen = document.getElementById("cartScreen");
 
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const cartNavBtn = document.getElementById("cartNavBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");
 
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const addButtons = document.querySelectorAll(".add-btn");

const PRODUCTS = [
  { title: "Paradise", artist: "Lana Del Rey", price: 1650 },
  { title: "Ctrl", artist: "SZA", price: 1250 },
  { title: "I Know I'm Funny haha", artist: "Faye Webster", price: 900 },
  { title: "Raven", artist: "Kelela", price: 1450 },
  { title: "Imaginal Disk", artist: "Magdalena Bay", price: 900 },
  { title: "Fancy That", artist: "PinkPantheress", price: 1500 }
];

let cart = [];

/* Shows one screen, hides the other */

function showScreen(screenToShow) {
  [loginScreen, homeScreen, cartScreen].forEach((screen) => {
    screen.style.display = (screen === screenToShow) ? "block" : "none";
  });
}

/* Login -> Home */

loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); 
  showScreen(homeScreen);
});

/* Home -> Login (log out) */
logoutBtn.addEventListener("click", function () {
  showScreen(loginScreen);
});

/* Home -> Cart */
cartNavBtn.addEventListener("click", function () {
  showScreen(cartScreen);
});

/* Cart -> Home */
backToHomeBtn.addEventListener("click", function () {
  showScreen(homeScreen);
});

/* Add to Cart */
addButtons.forEach((btn, index) => {
  btn.addEventListener("click", function () {
    const product = PRODUCTS[index];
    const existing = cart.find((item) => item.title === product.title);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
  });
});

function formatPrice(amount) {
  return "₱" + amount.toLocaleString("en-PH");
}
 
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;
 
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartEmptyMsg.style.display = "block";
    return;
  }
 
  cartEmptyMsg.style.display = "none";
  cartItemsEl.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <h3>${item.title}</h3>
      <p>${item.artist}</p>
      <p>Qty: ${item.qty}</p>
      <p>${formatPrice(item.price * item.qty)}</p>
    </div>
  `).join("");
}