/* ============================================================
   AMIR MEHRNAM — PORTFOLIO 2026
   Interactions: theme, cursor, parallax, reveal, tilt, magnetic
   ============================================================ */

(() => {
  "use strict";

  const html = document.documentElement;
  const body = document.body;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- 1. THEME ---------- */
  const THEME_KEY = "am-theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme =
    savedTheme ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  html.setAttribute("data-theme", initialTheme);

  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = themeBtn?.querySelector("i");

  const syncThemeIcon = () => {
    if (!themeIcon) return;
    const dark = html.getAttribute("data-theme") === "dark";
    themeIcon.className = dark ? "fas fa-sun" : "fas fa-moon";
  };
  syncThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    syncThemeIcon();
  });

  /* ---------- 2. NAV (burger + scroll state + active link) ---------- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const burger = document.getElementById("burger");

  burger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    const icon = burger.querySelector("i");
    if (icon) icon.className = open ? "fas fa-times" : "fas fa-bars";
  });

  navLinks?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      const icon = burger?.querySelector("i");
      if (icon) icon.className = "fas fa-bars";
    })
  );

  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("nav--scrolled", window.scrollY > 24);
  };
  onScrollNav();

  // active link on scroll
  const sections = [...document.querySelectorAll("section[id]")];
  const linkFor = (id) => navLinks?.querySelector(`a[href="#${id}"]`);

  const setActiveLink = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => {
      if (s.offsetTop <= y) current = s.id;
    });
    navLinks?.querySelectorAll("a").forEach((a) => a.classList.remove("is-active"));
    if (current) linkFor(current)?.classList.add("is-active");
  };

  /* ---------- 3. CUSTOM CURSOR ---------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (!isTouch && !prefersReduced && dot && ring) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hovering = false;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll('a, button, [data-cursor="link"]').forEach((el) => {
      el.addEventListener("mouseenter", () => {
        hovering = true;
        ring.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", () => {
        hovering = false;
        ring.classList.remove("is-hover");
      });
    });

    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  } else {
    dot?.remove();
    ring?.remove();
  }

  /* ---------- 4. MAGNETIC BUTTONS ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.28;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- 5. TILT CARDS ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const max = 6;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 6. REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 7. NUMBER COUNTERS ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- 8. PARALLAX ---------- */
  const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
  let ticking = false;

  const updateParallax = () => {
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      // only run while hero is roughly in view
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    ticking = false;
  };

  const requestParallax = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  /* ---------- 9. SCROLL PROGRESS + APPROACH BAR ---------- */
  const progressBar = document.getElementById("progressBar");
  const approachBar = document.getElementById("approachBar");
  const stepsSection = document.getElementById("steps");

  const updateProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progressBar) progressBar.style.width = p + "%";

    if (approachBar && stepsSection) {
      const rect = stepsSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const passed = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      const pct = Math.min((passed / total) * 100, 100);
      approachBar.style.width = pct + "%";
    }
  };

  /* ---------- 10. UNIFIED SCROLL HANDLER ---------- */
  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      onScrollNav();
      setActiveLink();
      updateProgress();
      if (!prefersReduced) updateParallax();
      scrollTicking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    onScroll();
  });

  /* ---------- 11. MARQUEE (duplicate for seamless loop) ---------- */
  const marquee = document.getElementById("marqueeTrack");
  if (marquee && !prefersReduced) {
    marquee.innerHTML += marquee.innerHTML;
  }

  /* ---------- 12. SMOOTH ANCHOR SCROLL (offset for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- 13. YEAR ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 14. KICKOFF ---------- */
  onScroll();
  updateProgress();
})();