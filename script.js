const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const topbar = document.querySelector(".topbar");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const scrollToSection = (hash) => {
  const target = document.querySelector(hash);

  if (!target) {
    return;
  }

  const headerOffset = topbar ? topbar.offsetHeight + 28 : 96;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });
};

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");

    if (!hash || hash === "#") {
      return;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    history.replaceState(null, "", hash);
    scrollToSection(hash);
  });
});

if (topbar) {
  let frameId = null;
  let currentProgress = 0;
  let targetProgress = 0;

  const setTargetProgress = () => {
    const compactStart = 6;
    const compactDistance = 150;
    const rawProgress = (window.scrollY - compactStart) / compactDistance;

    targetProgress = Math.min(Math.max(rawProgress, 0), 1);

    if (frameId === null) {
      frameId = window.requestAnimationFrame(animateTopbar);
    }
  };

  const animateTopbar = () => {
    const delta = targetProgress - currentProgress;

    currentProgress += delta * 0.14;

    if (Math.abs(delta) < 0.0015) {
      currentProgress = targetProgress;
    }

    topbar.style.setProperty("--header-progress", currentProgress.toFixed(4));

    if (Math.abs(targetProgress - currentProgress) >= 0.0015) {
      frameId = window.requestAnimationFrame(animateTopbar);
    } else {
      frameId = null;
    }
  };

  setTargetProgress();
  window.addEventListener("scroll", setTargetProgress, { passive: true });
  window.addEventListener("resize", setTargetProgress, { passive: true });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
