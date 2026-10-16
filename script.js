"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const typedText = document.getElementById("typedText");
  const currentYear = document.getElementById("currentYear");

  // Automatically update the copyright year.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("open");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Scroll progress and back-to-top visibility.
  function handleScroll() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollPosition = window.scrollY;

    const progress =
      scrollableHeight > 0
        ? (scrollPosition / scrollableHeight) * 100
        : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollPosition > 500);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  }

  // Typing animation.
  if (typedText) {
    const phrases = [
      "Embedded Systems",
      "Sustainable Materials",
      "Artificial Intelligence",
      "IoT & Smart Sensors",
      "Electronics Research",
      "Scientific Innovation"
    ];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      typedText.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = 0;
      let deleting = false;

      function typeNextCharacter() {
        const phrase = phrases[phraseIndex];

        if (!deleting) {
          characterIndex++;
          typedText.textContent = phrase.slice(0, characterIndex);

          if (characterIndex >= phrase.length) {
            deleting = true;
            window.setTimeout(typeNextCharacter, 1400);
            return;
          }

          window.setTimeout(typeNextCharacter, 75);
        } else {
          characterIndex--;
          typedText.textContent = phrase.slice(0, characterIndex);

          if (characterIndex <= 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            window.setTimeout(typeNextCharacter, 350);
            return;
          }

          window.setTimeout(typeNextCharacter, 35);
        }
      }

      typeNextCharacter();
    }
  }

  // Reveal elements when they enter the viewport.
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Project category filters.
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "")
          .split(/\s+/)
          .filter(Boolean);

        const shouldShow =
          selectedFilter === "all" ||
          categories.includes(selectedFilter);

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // Highlight the navigation link for the visible section.
  const sectionLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]:not(.nav-contact)'
  );

  const pageSections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window && sectionLinks.length) {
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          sectionLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            if (isActive) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    pageSections.forEach((section) => {
      activeSectionObserver.observe(section);
    });
  }

  // Close the mobile menu when the viewport becomes desktop-sized.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
});