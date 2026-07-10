const loginScreen = document.getElementById("loginScreen");
const homeScreen = document.getElementById("homeScreen");
const cartScreen = document.getElementById("cartScreen");
 
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const cartNavBtn = document.getElementById("cartNavBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const cartTotalEl = document.getElementById("cartTotal");
const cartTotalPriceEl = document.getElementById("cartTotalPrice");
 
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const addButtons = document.querySelectorAll(".add-btn");

const PRODUCTS = [
  { title: "Paradise", artist: "Lana Del Rey", price: 1650, cover: "IMAGES/PARADISE.png" },
  { title: "Ctrl", artist: "SZA", price: 1250, cover: "IMAGES/CTRL.png" },
  { title: "I Know I'm Funny haha", artist: "Faye Webster", price: 900, cover: "IMAGES/IKNOWIMFUNNYHAHA.png" },
  { title: "Raven", artist: "Kelela", price: 1450, cover: "IMAGES/RAVEN.png" },
  { title: "Imaginal Disk", artist: "Magdalena Bay", price: 900, cover: "IMAGES/IMAGINALDISK.png" },
  { title: "Fancy That", artist: "PinkPantheress", price: 1500, cover: "IMAGES/FANCYTHAT.png" }
];

let cart = [];

/* Shows one screen, hides the other */

function showScreen(screenToShow) {
  [loginScreen, homeScreen, cartScreen].forEach((screen) => {
    if (screen === screenToShow) {
      screen.style.display = (screen === loginScreen) ? "flex" : "block";
    } else {
      screen.style.display = "none";
    }
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

/* Add to cart */
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

/* Remove from cart */

cartItemsEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const title = e.target.dataset.title;
    cart = cart.filter((item) => item.title !== title);
    updateCartUI();
  }
});

function formatPrice(amount) {
  return "₱" + amount.toLocaleString("en-PH");
}
 
/* Cart UI Update (Totals, Items, Empty Message) */

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartEmptyMsg.style.display = "block";
    cartTotalEl.style.display = "none";
    return;
  }

  cartEmptyMsg.style.display = "none";
  cartTotalEl.style.display = "flex";

  cartItemsEl.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img class="cart-cover" src="${item.cover}" alt="${item.title} cover">
      <h3>${item.title}</h3>
      <p>${item.artist}</p>
      <p>Qty: ${item.qty}</p>
      <p>${formatPrice(item.price * item.qty)}</p>
      <button class="remove-btn" data-title="${item.title}">Remove</button>
    </div>
  `).join("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalPriceEl.textContent = formatPrice(totalPrice);
}