// Smooth Scroll for Navbar Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        const navbarNav = document.querySelector(".navbar-nav");
        if (navbarNav) {
          navbarNav.classList.remove("active");
        }
      }
    });
  });
}

// Parallax Effect
function initParallaxEffect() {
  window.addEventListener("scroll", () => {
    const parallax = document.querySelector(".hero-bg");
    if (parallax && window.innerWidth > 768) {
      requestAnimationFrame(() => {
        parallax.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
      });
    }
  });
}

// Initialize all effects
document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initParallaxEffect();
});

export { initSmoothScroll, initParallaxEffect };
