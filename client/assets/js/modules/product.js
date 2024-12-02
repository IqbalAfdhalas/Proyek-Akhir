// Konfigurasi API URL
const API_URL = "http://localhost:5000/api";

// Import addToCart function
import { addToCart, initializeProducts } from "./cart.js";

// Fungsi untuk mengambil data produk dari API
export async function fetchProductData() {
  try {
    // Gunakan endpoint produk aktif yang tidak memerlukan autentikasi
    const response = await fetch(`${API_URL}/products/active`);
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();
    return data.map((product) => ({
      ...product,
      image_url: product.image_url || "assets/images/logo_image.jpg",
    }));
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

// Fungsi untuk memformat harga ke format Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(price);
}

// Fungsi untuk merender loading state
function renderLoading(container) {
  container.innerHTML = `
    <div class="loading-state">
      <p>Memuat produk...</p>
    </div>
  `;
}

// Fungsi untuk merender error state
function renderError(container, message) {
  container.innerHTML = `
    <div class="error-state">
      <p>Error: ${message}</p>
      <button class="retry-load">Coba Lagi</button>
    </div>
  `;
}

// Fungsi untuk merender produk
async function renderProducts() {
  const productsContainer = document.querySelector(".products-container");

  if (!productsContainer) {
    console.error(".products-container not found in DOM.");
    return;
  }

  // Tampilkan loading state
  renderLoading(productsContainer);

  try {
    // Inisialisasi produk di cart.js
    await initializeProducts();

    // Ambil data dari API
    const products = await fetchProductData();

    // Cek apakah ada produk
    if (products.length === 0) {
      renderError(productsContainer, "Tidak ada produk tersedia.");
      return;
    }

    // Render produk
    productsContainer.innerHTML = products
      .map(
        (product) => `
          <div class="product-card">
            <img 
              src="${product.image_url}" 
              alt="${product.title}" 
              class="product-img"
            >
            <div class="product-content">
              <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <p class="product-description">${product.description}</p>
              </div>
              <button 
                class="add-to-cart" 
                data-product-id="${product.id}"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        `
      )
      .join("");

    // Tambahkan event listener untuk tombol "Tambah ke Keranjang"
    const addToCartButtons = productsContainer.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.productId);
        addToCart(productId);
      });
    });

    // Tambahkan event listener untuk tombol coba lagi (jika ada)
    const retryButton = productsContainer.querySelector(".retry-load");
    if (retryButton) {
      retryButton.addEventListener("click", renderProducts);
    }
  } catch (error) {
    renderError(
      productsContainer,
      "Gagal memuat produk. Silakan coba lagi nanti."
    );
  }
}

export { renderProducts };
