import { updateCartUI, updateCartCounter } from "./cart.js";

let checkoutModal;

function showCheckoutModal(cart) {
  console.log("Data keranjang yang dikirim ke checkout:", cart);

  checkoutModal = document.querySelector(".checkout-modal");

  if (!checkoutModal) {
    console.error("Modal checkout tidak ditemukan");
    return;
  }

  updateCheckoutUI(cart);
  checkoutModal.style.display = "block";

  initCheckoutEvents(cart);
}

function hideCheckoutModal() {
  if (checkoutModal) {
    checkoutModal.style.display = "none";
  }
}

function updateCheckoutUI(cart) {
  const checkoutItems = document.querySelector("#checkout-items");
  const checkoutTotal = document.querySelector("#checkout-total-amount");

  if (checkoutItems && checkoutTotal) {
    checkoutItems.innerHTML = cart
      .map(
        (item) => ` 
        <div class="checkout-item">
          <div class="item-name">${item.title} x ${item.quantity}</div>
          <div class="item-price">Rp ${(
            item.price * item.quantity
          ).toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}</div>
        </div>
      `
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    checkoutTotal.textContent = `Rp ${total.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
}

function formatWhatsAppMessage(formData, cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Format order items
  const orderItems = cart
    .map(
      (item) =>
        `- ${item.title} (${
          item.quantity
        }x, Rp ${item.price.toLocaleString()} per item)`
    )
    .join("\n");

  const message = `
*DATA CUSTOMER*
Nama: ${formData.name}
Email: ${formData.email}
No HP: ${formData.phone}
Alamat: ${formData.address}

*DATA PESANAN*
${orderItems}

*Total Pembayaran: Rp ${total.toLocaleString()}*

Saya ingin memesan produk di atas. Apakah semua produk tersedia? Terima kasih.`;

  return encodeURIComponent(message.trim());
}

function handlePayment(e, cart) {
  e.preventDefault();

  // Get form data
  const formData = {
    name: document.querySelector('input[name="fullname"]')?.value,
    email: document.querySelector('input[name="email"]')?.value,
    phone: document.querySelector('input[name="phone"]')?.value,
    address: document.querySelector('textarea[name="address"]')?.value,
  };

  if (
    !formData.name ||
    !formData.email ||
    !formData.phone ||
    !formData.address
  ) {
    alert("Mohon lengkapi semua data!");
    return;
  }

  // Format WhatsApp message
  const message = formatWhatsAppMessage(formData, cart);

  // WhatsApp phone number (replace with your business number)
  const phoneNumber = "6285219789628"; // Ganti dengan nomor WhatsApp bisnis Anda

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Open WhatsApp in new tab
  window.open(whatsappUrl, "_blank");

  // Clear cart and close modal
  cart.length = 0;
  updateCartUI();
  updateCartCounter();
  hideCheckoutModal();
}

function initCheckoutEvents(cart) {
  const closeCheckoutButton = document.querySelector(".close-checkout");
  const paymentButton = document.querySelector(".pay-btn");
  const backButton = document.querySelector(".back-to-cart");

  if (closeCheckoutButton) {
    closeCheckoutButton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        hideCheckoutModal();
      },
      { once: true }
    );
  }

  if (backButton) {
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      backToCart();
    });
  }

  if (paymentButton) {
    paymentButton.addEventListener("click", (e) => handlePayment(e, cart), {
      once: true,
    });
  }

  window.addEventListener(
    "click",
    (e) => {
      if (e.target === checkoutModal) {
        hideCheckoutModal();
      }
    },
    { once: true }
  );
}

function backToCart() {
  hideCheckoutModal();
  const cartModal = document.querySelector(".cart-modal");
  if (cartModal) {
    cartModal.style.display = "block";
  }
}

export { showCheckoutModal, hideCheckoutModal, backToCart };
window.backToCart = backToCart;
