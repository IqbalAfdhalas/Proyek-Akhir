// Adjust Menu Height for Mobile
function adjustMenuHeight(reset = false) {
  const navbarNav = document.querySelector(".navbar-nav");
  if (navbarNav && window.innerWidth <= 450) {
    document.documentElement.style.setProperty(
      "--menu-height",
      reset || !navbarNav.classList.contains("active")
        ? "0px"
        : `${navbarNav.scrollHeight}px`
    );
  }
}

// Initialize Header Functionality
function initHeader() {
  const hamburger = document.querySelector("#hamburger-menu");
  const navbarNav = document.querySelector(".navbar-nav");

  if (hamburger && navbarNav) {
    // Hamburger Menu Toggle
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      navbarNav.classList.toggle("active");
      adjustMenuHeight();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove("active");
        adjustMenuHeight(true);
      }
    });

    // Adjust menu height on window resize
    window.addEventListener("resize", () => adjustMenuHeight(true));

    // Initial adjustment for menu height
    adjustMenuHeight();
  } else {
    console.error("Elemen #hamburger-menu atau .navbar-nav tidak ditemukan.");
  }
}

function handleNewsletterSubscription() {
  alert(
    "🚧 Fitur newsletter masih dalam pengembangan! 📧\n\nTerima kasih atas antusiasme Anda. Kami sedang menyiapkan sesuatu yang istimewa untuk Anda. Silakan kembali lagi nanti! 🌟"
  );
}

export { adjustMenuHeight, initHeader, handleNewsletterSubscription };
