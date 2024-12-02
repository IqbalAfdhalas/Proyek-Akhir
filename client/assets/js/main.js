// Pastikan Feather Icons tersedia
function initFeatherIcons() {
  if (typeof feather !== "undefined") {
    feather.replace();
    console.log("Feather Icons initialized.");
  } else {
    console.error("Feather Icons library is not loaded.");
  }
}

// Import all JavaScript modules
import {
  adjustMenuHeight,
  initHeader,
  handleNewsletterSubscription,
} from "./modules/header.js";
import { renderProducts } from "./modules/product.js";
import { updateCartCounter, initCart } from "./modules/cart.js";
import { initSmoothScroll, initParallaxEffect } from "./modules/effect.js";
import { renderMenu } from "./modules/menu.js";

// Fungsi untuk memuat file HTML ke dalam elemen
async function loadContent(target, file, callback) {
  try {
    const response = await fetch(file);
    if (response.ok) {
      const content = await response.text();
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.innerHTML = content;
        // Eksekusi callback jika diberikan
        if (typeof callback === "function") callback();
      } else {
        console.error(`Target element ${target} not found`);
      }
    } else {
      console.error(`File tidak ditemukan: ${file}`);
    }
  } catch (error) {
    console.error(`Error loading content for ${file}:`, error);
  }
}

// Fungsi untuk memuat semua komponen
async function loadAllComponents() {
  const components = [
    { target: "header", file: "component/header.html", callback: initHeader },
    { target: "cart", file: "component/cart.html", callback: initCart },
    { target: "checkout", file: "component/checkout.html" },
    { target: "footer", file: "component/footer.html" },
  ];

  const pages = [
    { target: "home", file: "page/home.html" },
    { target: "about", file: "page/about.html" },
    { target: "menu", file: "page/menu.html", callback: renderMenu },
    { target: "product", file: "page/product.html", callback: renderProducts },
    { target: "contact", file: "page/contact.html" },
  ];

  try {
    // Load all components
    await Promise.all(
      components.map(({ target, file, callback }) =>
        loadContent(target, file, callback)
      )
    );

    // Load all pages
    await Promise.all(
      pages.map(({ target, file, callback }) =>
        loadContent(target, file, callback)
      )
    );

    console.log("All components loaded successfully.");
    return true;
  } catch (error) {
    console.error("Error loading components or pages:", error);
    return false;
  }
}

// Initialize all JavaScript functionality
function initializeJavaScript() {
  // Initialize cart counter
  updateCartCounter();

  // Initialize effects
  initSmoothScroll();
  initParallaxEffect();

  const newsletterButton = document.querySelector(".footer-newsletter");
  if (newsletterButton) {
    newsletterButton.addEventListener("click", handleNewsletterSubscription);
  }

  console.log("All JavaScript functionality initialized successfully.");
}

// Main initialization
document.addEventListener("DOMContentLoaded", async () => {
  // Feather Icons initialization
  initFeatherIcons();

  // Load all HTML components
  const componentsLoaded = await loadAllComponents();

  if (componentsLoaded) {
    // Initialize JavaScript setelah semua komponen termuat
    initializeJavaScript();

    // Replace Feather Icons setelah semua konten dimuat
    initFeatherIcons();
  } else {
    console.error("Failed to load some components.");
  }
});

// Handle dynamic page navigation
window.addEventListener("hashchange", async () => {
  const hash = window.location.hash.slice(1) || "home";

  // Hide all pages first
  document.querySelectorAll(".page-content").forEach((page) => {
    page.style.display = "none";
  });

  // Show and initialize current page
  const currentPage = document.querySelector(`#${hash}`);
  if (currentPage) {
    currentPage.style.display = "block";

    // Re-initialize products when navigating to products page
    if (hash === "product") {
      initializeProducts();
    }
    // Add other page-specific initializations here if needed
  }
});

// Export functions if needed by other modules
export { loadContent, loadAllComponents };
