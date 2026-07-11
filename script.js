const loginScreen = document.getElementById("loginScreen");
const homeScreen = document.getElementById("homeScreen");
const cartScreen = document.getElementById("cartScreen");
const checkoutScreen = document.getElementById("checkoutScreen");
 
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const cartNavBtn = document.getElementById("cartNavBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const homeNavLinks = document.querySelectorAll(".home-nav-link");
const cartTotalEl = document.getElementById("cartTotal");
const cartTotalPriceEl = document.getElementById("cartTotalPrice");
 
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const addButtons = document.querySelectorAll(".add-btn");
const checkoutBtn = document.getElementById("checkoutBtn");
const backToCartBtn = document.getElementById("backToCartBtn");
const checkoutSummaryEl = document.getElementById("checkoutSummary");
const checkoutTotalPriceEl = document.getElementById("checkoutTotalPrice");
const checkoutForm = document.getElementById("checkoutForm");
const productCards = document.querySelectorAll(".product-card");
const productModal = document.getElementById("productModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalArtist = document.getElementById("modalArtist");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalAddBtn = document.getElementById("modalAddBtn");
const modalBuyBtn = document.getElementById("modalBuyBtn");

let activeModalProduct = null;

const PRODUCTS = [
  { title: "Paradise", artist: "Lana Del Rey", price: 1650, cover: "IMAGES/PARADISE.png", description: "A moody, atmospheric collection of tracks exploring fame, longing, and the American dream." },
  { title: "Ctrl", artist: "SZA", price: 1250, cover: "IMAGES/CTRL.png", description: "A defining alt-R&B record about vulnerability, insecurity, and self-discovery." },
  { title: "I Know I'm Funny haha", artist: "Faye Webster", price: 900, cover: "IMAGES/IKNOWIMFUNNYHAHA.png", description: "Warm, wry indie-folk with pedal steel guitar and disarmingly honest lyrics." },
  { title: "Raven", artist: "Kelela", price: 1450, cover: "IMAGES/RAVEN.png", description: "A shape-shifting, atmospheric R&B record about grief, intimacy, and rebirth." },
  { title: "Imaginal Disk", artist: "Magdalena Bay", price: 900, cover: "IMAGES/IMAGINALDISK.png", description: "A hyperpop-tinged concept album about transformation and identity." },
  { title: "Fancy That", artist: "PinkPantheress", price: 1500, cover: "IMAGES/FANCYTHAT.png", description: "Breezy, drum-and-bass-inspired pop with a nostalgic, diary-entry feel." }
];

const CART_KEY = "theme_yay_cart";

function loadCart() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

/* Shows one screen, hides the other */

function showScreen(screenToShow) {
  [loginScreen, homeScreen, cartScreen, checkoutScreen].forEach((screen) => {
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

/* Home nav -> Home screen */
homeNavLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    showScreen(homeScreen);
  });
});

/* Cart -> Home */
backToHomeBtn.addEventListener("click", function () {
  showScreen(homeScreen);
});

/* Cart -> Checkout */
checkoutBtn.addEventListener("click", function () {
  renderCheckoutSummary();
  showScreen(checkoutScreen);
});

/* Checkout -> Cart */
backToCartBtn.addEventListener("click", function () {
  showScreen(cartScreen);
});

/* Place order */
checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault();
  cart = [];
  saveCart();
  updateCartUI();
  checkoutForm.reset();
  showScreen(homeScreen);
});

function addProductToCart(product) {
   const existing = cart.find((item) => item.title === product.title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

/* Add to cart */
addButtons.forEach((btn, index) => {
  btn.addEventListener("click", function () {
    addProductToCart(PRODUCTS[index]);
  });
});

/* Open product modal on card click */
productCards.forEach((card, index) => {
  card.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-btn")) return;

    const product = PRODUCTS[index];
    activeModalProduct = product;

    modalCover.src = product.cover;
    modalCover.alt = product.title + " cover";
    modalTitle.textContent = product.title;
    modalArtist.textContent = product.artist;
    modalPrice.textContent = formatPrice(product.price);
    modalDescription.textContent = product.description;

    productModal.style.display = "flex";
  });
});

/* Close product modal */
modalCloseBtn.addEventListener("click", function () {
  productModal.style.display = "none";
});

productModal.addEventListener("click", function (e) {
  if (e.target === productModal) {
    productModal.style.display = "none";
  }
});

/* Modal Add to Cart */
modalAddBtn.addEventListener("click", function () {
  addProductToCart(activeModalProduct);
  productModal.style.display = "none";
});

/* Modal Buy Now */
modalBuyBtn.addEventListener("click", function () {
  addProductToCart(activeModalProduct);
  productModal.style.display = "none";
  renderCheckoutSummary();
  showScreen(checkoutScreen);
});

/* Remove from cart */

cartItemsEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const title = e.target.dataset.title;
    const itemEl = e.target.closest(".cart-item");
 
    itemEl.classList.add("removing");
    itemEl.addEventListener("animationend", function () {
      cart = cart.filter((item) => item.title !== title);
      saveCart();
      updateCartUI();
    }, { once: true });
  }
  if (e.target.classList.contains("qty-increase")) {
    const title = e.target.dataset.title;
    const item = cart.find((item) => item.title === title);
    item.qty += 1;
    saveCart();
    updateCartUI();
  }

  if (e.target.classList.contains("qty-decrease")) {
    const title = e.target.dataset.title;
    const item = cart.find((item) => item.title === title);

    if (item.qty > 1) {
      item.qty -= 1;
      saveCart();
      updateCartUI();
    } else {
      const itemEl = e.target.closest(".cart-item");
      itemEl.classList.add("removing");
      itemEl.addEventListener("animationend", function () {
        cart = cart.filter((item) => item.title !== title);
        saveCart();
        updateCartUI();
      }, { once: true });
    }
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
    checkoutBtn.style.display = "none";
    return;
  }

  cartEmptyMsg.style.display = "none";
  cartTotalEl.style.display = "flex";
  checkoutBtn.style.display = "block";

  cartItemsEl.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img class="cart-cover" src="${item.cover}" alt="${item.title} cover">
      <h3>${item.title}</h3>
      <p class="cart-artist">${item.artist}</p>
      <div class="qty-controls">
        <button type="button" class="qty-btn qty-decrease" data-title="${item.title}">-</button>
        <span class="qty-value">${item.qty}</span>
        <button type="button" class="qty-btn qty-increase" data-title="${item.title}">+</button>
      </div>
      <p class="cart-price">${formatPrice(item.price * item.qty)}</p>
      <button class="remove-btn" data-title="${item.title}">Remove</button>
    </div>
  `).join("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalPriceEl.textContent = formatPrice(totalPrice);
}

updateCartUI();
if (window.location.hash === "#cart") {
  showScreen(cartScreen);
}
if (window.location.hash === "#home") {
   showScreen(homeScreen);
 }

 function renderCheckoutSummary() {
  checkoutSummaryEl.innerHTML = cart.map((item) => `
    <div class="checkout-item">
      <span>${item.title} (x${item.qty})</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  checkoutTotalPriceEl.textContent = formatPrice(totalPrice);
}