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
const productGrid = document.getElementById("productGrid");

// Popup refs
const popupOverlay = document.getElementById("popupOverlay");
const closePopupBtn = document.getElementById("closePopup");
const popupCover = document.getElementById("popupCover");
const popupTitle = document.getElementById("popupTitle");
const popupArtist = document.getElementById("popupArtist");
const popupPrice = document.getElementById("popupPrice");
const popupDescription = document.getElementById("popupDescription");
const popupAddBtn = document.getElementById("popupAddBtn");
const popupBuyBtn = document.getElementById("popupBuyBtn");

// ---------- SCREEN MANAGEMENT ----------
function showScreen(screen) {
  [loginScreen, homeScreen, cartScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
  [loginScreen, homeScreen, cartScreen].forEach(s => {
    s.style.display = "none";
  });
  screen.style.display = (screen === loginScreen) ? "flex" : "block";
}

// ---------- RENDER PRODUCT CARDS ----------
function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((product, index) => `
    <article class="product-card" data-index="${index}">
      <img src="${product.cover}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p class="artist">${product.artist}</p>
      <p class="price">₱${product.price.toLocaleString("en-PH")}</p>
      <p class="description">${product.description}</p>
      <div class="button-group">
        <button type="button" class="add-btn" data-index="${index}">Add to Cart</button>
        <button type="button" class="buy-btn" data-index="${index}">Buy Now</button>
      </div>
    </article>
  `).join("");

  // Attach click events to cards (open popup)
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", function(e) {
      // Prevent opening if the click is on a button inside the card
      if (e.target.closest("button")) return;
      const index = parseInt(this.dataset.index);
      openPopup(index);
    });
  });

  // Attach Add to Cart buttons
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation(); // prevent card click from firing
      const index = parseInt(this.dataset.index);
      addToCart(index);
    });
  });

  // Attach Buy Now buttons (they will open popup instead of direct purchase)
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      const index = parseInt(this.dataset.index);
      openPopup(index);
    });
  });
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

// ---------- POPUP ----------
function openPopup(index) {
  const p = PRODUCTS[index];
  popupCover.src = p.cover;
  popupTitle.textContent = p.title;
  popupArtist.textContent = p.artist;
  popupPrice.textContent = `₱${p.price.toLocaleString("en-PH")}`;
  popupDescription.textContent = p.description;
  // Store index on popup buttons for later use
  popupAddBtn.dataset.index = index;
  popupBuyBtn.dataset.index = index;
  popupOverlay.classList.add("active");
  popupOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePopup() {
  popupOverlay.classList.remove("active");
  popupOverlay.style.display = "none";
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

// Popup close
closePopupBtn.addEventListener("click", closePopup);
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) closePopup();
});

// Popup buttons
popupAddBtn.addEventListener("click", function() {
  const index = parseInt(this.dataset.index);
  addToCart(index);
  closePopup();
});

popupBuyBtn.addEventListener("click", function() {
  const index = parseInt(this.dataset.index);
  addToCart(index);
  closePopup();
  alert("Thank you for your purchase! 🎵 Your order has been placed.");
});

// ---------- INIT ----------
renderProducts();
showScreen(loginScreen);
