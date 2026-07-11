// ---------- PRODUCT DATA ----------
const PRODUCTS = [
  {
    title: "Paradise",
    artist: "Lana Del Rey",
    price: 1650,
    cover: "IMAGES/PARADISE.png",
    description: "Lana Del Rey's seventh studio album, featuring a cinematic soundscape and nostalgic Americana."
  },
  {
    title: "Ctrl",
    artist: "SZA",
    price: 1250,
    cover: "IMAGES/CTRL.png",
    description: "SZA's debut studio album, a blend of R&B, soul, and neo-soul with introspective lyrics."
  },
  {
    title: "I Know I'm Funny haha",
    artist: "Faye Webster",
    price: 900,
    cover: "IMAGES/IKNOWIMFUNNYHAHA.png",
    description: "Faye Webster's fourth studio album, blending indie folk, R&B, and country influences."
  },
  {
    title: "Raven",
    artist: "Kelela",
    price: 1450,
    cover: "IMAGES/RAVEN.png",
    description: "Kelela's second studio album, exploring electronic, R&B, and ambient sounds."
  },
  {
    title: "Imaginal Disk",
    artist: "Magdalena Bay",
    price: 900,
    cover: "IMAGES/IMAGINALDISK.png",
    description: "Magdalena Bay's debut studio album, a synth-pop journey with dreamy production."
  },
  {
    title: "Fancy That",
    artist: "PinkPantheress",
    price: 1500,
    cover: "IMAGES/FANCYTHAT.png",
    description: "PinkPantheress's debut mixtape, featuring UK garage and pop-infused tracks."
  }
];

// ---------- STATE ----------
let cart = [];

// ---------- DOM REFS ----------
const loginScreen = document.getElementById("loginScreen");
const homeScreen = document.getElementById("homeScreen");
const cartScreen = document.getElementById("cartScreen");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const cartNavBtn = document.getElementById("cartNavBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const cartTotalEl = document.getElementById("cartTotal");
const cartTotalPriceEl = document.getElementById("cartTotalPrice");
const cartCountEl = document.getElementById("cartCount");

// Modal refs
const buyModal = document.getElementById("buyModal");
const closeModal = document.getElementById("closeModal");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalArtist = document.getElementById("modalArtist");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalAddToCart = document.getElementById("modalAddToCart");
const modalBuyNow = document.getElementById("modalBuyNow");

// ---------- SCREEN MANAGEMENT ----------
function showScreen(screen) {
  [loginScreen, homeScreen, cartScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
  [loginScreen, homeScreen, cartScreen].forEach(s => {
    s.style.display = "none";
  });
  screen.style.display = (screen === loginScreen) ? "flex" : "block";
}

// ---------- CART ----------
function addToCart(index) {
  const product = PRODUCTS[index];
  const existing = cart.find(item => item.title === product.title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function removeFromCart(title) {
  const existing = cart.find(item => item.title === title);
  if (existing) {
    if (existing.qty > 1) existing.qty -= 1;
    else cart = cart.filter(item => item.title !== title);
  }
  updateCartUI();
}

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

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <img src="${item.cover}" alt="${item.title}">
        <div>
          <span class="item-title">${item.title}</span>
          <span class="item-artist">${item.artist}</span>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="cart-decrease" data-title="${item.title}">−</button>
        <span>${item.qty}</span>
        <button class="cart-increase" data-title="${item.title}">+</button>
        <span>₱${(item.price * item.qty).toLocaleString("en-PH")}</span>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".cart-decrease").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.title));
  });
  document.querySelectorAll(".cart-increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = PRODUCTS.find(p => p.title === btn.dataset.title);
      if (product) addToCart(PRODUCTS.indexOf(product));
    });
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalPriceEl.textContent = `₱${total.toLocaleString("en-PH")}`;
}

// ---------- MODAL ----------
function openModal(index) {
  const p = PRODUCTS[index];
  modalCover.src = p.cover;
  modalTitle.textContent = p.title;
  modalArtist.textContent = p.artist;
  modalDescription.textContent = p.description;
  modalPrice.textContent = `₱${p.price.toLocaleString("en-PH")}`;
  modalAddToCart.dataset.index = index;
  modalBuyNow.dataset.index = index;
  buyModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModalFn() {
  buyModal.style.display = "none";
  document.body.style.overflow = "auto";
}

// ---------- EVENT LISTENERS ----------

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showScreen(homeScreen);
});

// Logout
logoutBtn.addEventListener("click", () => {
  cart = [];
  updateCartUI();
  showScreen(loginScreen);
});

// Cart nav
cartNavBtn.addEventListener("click", () => showScreen(cartScreen));
backToHomeBtn.addEventListener("click", () => showScreen(homeScreen));

// Add to Cart buttons (hardcoded in HTML)
document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.dataset.index);
    addToCart(index);
  });
});

// Buy Now buttons (hardcoded in HTML)
document.querySelectorAll(".buy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.dataset.index);
    openModal(index);
  });
});

// Modal close
closeModal.addEventListener("click", closeModalFn);
window.addEventListener("click", (e) => {
  if (e.target === buyModal) closeModalFn();
});

// Modal buttons
modalAddToCart.addEventListener("click", () => {
  const index = parseInt(modalAddToCart.dataset.index);
  addToCart(index);
  closeModalFn();
});

modalBuyNow.addEventListener("click", () => {
  const index = parseInt(modalBuyNow.dataset.index);
  addToCart(index);
  closeModalFn();
  alert("Thank you for your purchase! 🎵 Your order has been placed.");
});

// ---------- INIT ----------
showScreen(loginScreen);
