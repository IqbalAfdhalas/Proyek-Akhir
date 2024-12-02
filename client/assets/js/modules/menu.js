// menu.js

// Konfigurasi API URL
const API_URL = "http://localhost:5000/api";

// Fungsi untuk mengambil data menu dari API
async function fetchMenuData() {
  try {
    // Menggunakan getActiveMenu untuk hanya menampilkan menu yang aktif
    const response = await fetch(`${API_URL}/menu/active`);
    if (!response.ok) {
      throw new Error("Failed to fetch menu data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return [];
  }
}

// Fungsi untuk memformat harga ke format Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Fungsi untuk merender loading state
function renderLoading(container) {
  container.innerHTML = `
    <div class="loading-state">
      <p>Loading menu...</p>
    </div>
  `;
}

// Fungsi untuk merender error state
function renderError(container, message) {
  container.innerHTML = `
    <div class="error-state">
      <p>Error: ${message}</p>
    </div>
  `;
}

// Fungsi untuk merender menu ke dalam HTML
async function renderMenu() {
  const menuContainer = document.querySelector(".menu-container");
  if (!menuContainer) {
    console.error("Menu container tidak ditemukan");
    return;
  }

  // Tampilkan loading state
  renderLoading(menuContainer);

  try {
    // Ambil data dari API
    const menuData = await fetchMenuData();

    // Render data menu
    menuContainer.innerHTML = menuData
      .map(
        (item) => `
          <div class="menu-card">
            <img
              src="${item.image_url || "assets/images/logo_image.jpg"}"
              alt="${item.title}"
              class="menu-card-img"
            />
            <div class="menu-card-content">
              <h3 class="menu-card-title">${item.title}</h3>
              <p class="menu-card-description">${item.description}</p>
              <hr />
              <div class="menu-card-price-container">
                <span class="menu-card-price">${formatPrice(item.price)}</span>
                ${
                  item.badge
                    ? `<span class="menu-card-badge">${item.badge}</span>`
                    : ""
                }
              </div>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    renderError(menuContainer, "Gagal memuat menu. Silakan coba lagi nanti.");
  }
}

export { renderMenu }; // Ekspor fungsi renderMenu
