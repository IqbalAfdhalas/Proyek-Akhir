// cart.js
import { fetchProductData } from "./product.js";

let cart = [];
let productsCache = [];

async function initializeProducts() {
  if (productsCache.length === 0) {
    productsCache = await fetchProductData();
  }
}

function addToCart(productId) {
  // Pastikan produk sudah diinisialisasi
  if (productsCache.length === 0) {
    console.error("Produk belum dimuat");
    return;
  }

  const product = productsCache.find((item) => item.id === productId);
  if (product) {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    updateCartCounter();
  }

  console.log("Produk yang ditambahkan ke keranjang:", product);
}

function updateCartCounter() {
  const cartCounter = document.getElementById("cart-counter");
  if (cartCounter) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? "flex" : "none";
    // Tambahkan animasi dengan class
    cartCounter.classList.add("badge-pop");
    // Hapus class setelah animasi selesai
    setTimeout(() => cartCounter.classList.remove("badge-pop"), 300);
  }
}

function updateCartUI() {
  const cartItems = document.querySelector(".cart-items");
  const totalAmount = document.querySelector("#cart-total-amount");

  if (cartItems && totalAmount) {
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image_url || "assets/images/logo_image.jpg"}" alt="${
          item.title
        }">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus">+</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    totalAmount.textContent = `Rp ${total.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    // Add event listeners using delegation
    cartItems.addEventListener("click", handleQuantityClick);
  }
}

function handleQuantityClick(e) {
  if (!e.target.classList.contains("quantity-btn")) return;

  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  const productId = parseInt(cartItem.dataset.productId);
  const change = e.target.classList.contains("plus") ? 1 : -1;

  updateQuantity(productId, change);
}

function updateQuantity(productId, change) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
    updateCartUI();
    updateCartCounter();
  }
}

function initCart() {
  const cartModal = document.querySelector(".cart-modal");
  const closeCartButton = document.querySelector(".close-cart");
  const shoppingCartIcon = document.querySelector("#shopping-cart");
  const checkoutButton = document.querySelector(".checkout-btn");

  if (cartModal && closeCartButton && shoppingCartIcon) {
    closeCartButton.addEventListener("click", (e) => {
      e.preventDefault();
      cartModal.style.display = "none";
    });

    shoppingCartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      cartModal.style.display = "block";
    });

    // Add checkout button event listener
    if (checkoutButton) {
      checkoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Tombol checkout ditekan");

        if (cart.length === 0) {
          alert("Keranjang belanja kosong!");
          return;
        }
        import("./checkout.js")
          .then((module) => {
            console.log("Module checkout berhasil di-load");
            module.showCheckoutModal(cart);
          })

          .catch((err) => {
            console.error("Error saat mengimpor modul checkout:", err); // Log 3
          });
      });
    }
  }
}

export {
  cart,
  addToCart,
  updateCartUI,
  updateCartCounter,
  initCart,
  initializeProducts,
};
