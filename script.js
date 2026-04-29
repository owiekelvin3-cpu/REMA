/* ============================================================
   REMA — Premium Artist Website | JavaScript
   ============================================================ */

(function () {
  "use strict";

  /* ── Dark Dot Cursor (heisrema.com style) ────────────────── */
  const isTouch = window.matchMedia("(hover: none)").matches;

  if (!isTouch) {
    // Create elements
    const dot  = document.createElement("div");
    const ring = document.createElement("div");
    const glow = document.createElement("div");
    dot.className  = "cursor-dot";
    ring.className = "cursor-ring";
    glow.className = "cursor-glow";
    document.body.append(dot, ring, glow);

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let glowX  = 0, glowY  = 0;

    // Dot snaps instantly via JS (no CSS transition on position)
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top  = mouseY + "px";
    });

    // Ring + glow lag behind with lerp
    (function animateCursor() {
      // Ring — medium lag
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top  = ringY + "px";

      // Glow — slow lag
      glowX += (mouseX - glowX) * 0.05;
      glowY += (mouseY - glowY) * 0.05;
      glow.style.left = glowX + "px";
      glow.style.top  = glowY + "px";

      requestAnimationFrame(animateCursor);
    })();

    // Hover state — expand ring, colour dot red
    const clickables = "a, button, .music-card, .vid-card, .gallery__item, .impact-stat, .nav__logo, select, label";
    document.querySelectorAll(clickables).forEach(el => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("is-hovering");
        ring.classList.add("is-hovering");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("is-hovering");
        ring.classList.remove("is-hovering");
      });
    });

    // Text input state — cursor becomes a caret
    const textEls = "input, textarea, [contenteditable]";
    document.querySelectorAll(textEls).forEach(el => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("is-text");
        ring.classList.add("is-text");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("is-text");
        ring.classList.remove("is-text");
      });
    });

    // Click state — compress both
    document.addEventListener("mousedown", () => {
      dot.classList.add("is-clicking");
      ring.classList.add("is-clicking");
    });
    document.addEventListener("mouseup", () => {
      dot.classList.remove("is-clicking");
      ring.classList.remove("is-clicking");
    });

    // Hide when leaving window
    document.addEventListener("mouseleave", () => {
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity  = "1";
      ring.style.opacity = "1";
    });
  }

  /* ── Nav scroll state (throttled) ────────────────────────── */
  const nav = document.getElementById("nav");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle("scrolled", window.scrollY > 60);
        // Hero parallax inside same rAF
        const y = window.scrollY;
        if (y < window.innerHeight) {
          if (heroVid)     heroVid.style.transform = `translateY(${y * 0.2}px)`;
          if (heroContent) {
            heroContent.style.transform = `translateY(${y * 0.1}px)`;
            heroContent.style.opacity   = Math.max(0, 1 - y / (window.innerHeight * 0.7)).toFixed(3);
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── Mobile menu ──────────────────────────────────────────── */
  const burger     = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;
  burger.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const spans = burger.querySelectorAll("span");
    if (menuOpen) {
      spans[0].style.transform = "rotate(45deg) translate(4px, 4px)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "rotate(-45deg) translate(4px, -4px)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    }
  });
  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
      burger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    });
  });

  /* ── Scroll reveal ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-scale");
  revealEls.forEach(el => {
    if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "s";
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  revealEls.forEach(el => revealObserver.observe(el));
  document.querySelectorAll(".music-card").forEach(card => revealObserver.observe(card));

  /* ── Animated counters ────────────────────────────────────── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target; clearInterval(timer); }
      else { el.textContent = Math.floor(start); }
    }, 16);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count, 10), 1800);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".impact-stat__num[data-count]").forEach(el => counterObserver.observe(el));

  /* ── Hero particles (reduced on mobile) ──────────────────── */
  const particleContainer = document.getElementById("particles");
  const isMobile = window.innerWidth < 768;

  function createParticle() {
    const p = document.createElement("div");
    p.className = "particle";
    const size     = Math.random() * 3 + 1;
    const duration = Math.random() * 12 + 8;
    const delay    = Math.random() * 8;
    const drift    = (Math.random() - 0.5) * 200;
    const colors   = ["rgba(192,57,43,0.6)", "rgba(245,245,240,0.3)", "rgba(201,168,76,0.4)"];
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:-10px;background:${colors[Math.floor(Math.random()*3)]};animation-duration:${duration}s;animation-delay:${delay}s;--drift:${drift}px;`;
    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000);
  }
  // Fewer particles on mobile to save CPU
  const particleInterval = isMobile ? 1200 : 400;
  (function spawnParticles() {
    createParticle();
    setTimeout(spawnParticles, Math.random() * particleInterval + particleInterval * 0.5);
  })();

  /* ── Hero video ref (used in throttled scroll above) ─────── */
  const heroVid     = document.querySelector(".hero .vid-bg video");
  const heroContent = document.querySelector(".hero__content");

  /* ── Background videos: play/pause on viewport ────────────── */
  // All vid-bg videos (section backgrounds) — play when visible, pause when not
  const bgVideos = document.querySelectorAll(".vid-bg video");
  const bgVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        v.play().catch(() => {});   // play — ignore autoplay policy errors
      } else {
        v.pause();                  // pause off-screen to save CPU
      }
    });
  }, { threshold: 0.01 });         // trigger as soon as 1% is visible
  bgVideos.forEach(v => bgVideoObserver.observe(v));

  /* ── Video reel cards: auto-play when visible ────────────── */
  document.querySelectorAll(".vid-card .vid-card__video").forEach(video => {
    // Always keep muted by default
    video.muted = true;

    // Play/pause based on viewport visibility
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.muted = true; // re-mute when scrolled away
        }
      });
    }, { threshold: 0.2 });
    obs.observe(video.closest(".vid-card"));

    const card = video.closest(".vid-card");

    // Hover over card → unmute
    card.addEventListener("mouseenter", () => {
      video.muted = false;
    });

    // Leave card → mute immediately
    card.addEventListener("mouseleave", () => {
      video.muted = true;
    });

    // Click → fullscreen with sound
    card.addEventListener("click", () => {
      video.muted = false;
      if (video.requestFullscreen)            video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      video.play().catch(() => {});
    });

    // Exiting fullscreen → mute again
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        video.muted = true;
      }
    });
    document.addEventListener("webkitfullscreenchange", () => {
      if (!document.webkitFullscreenElement) {
        video.muted = true;
      }
    });
  });

  /* ── Smooth anchor scroll ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: "smooth" });
    });
  });

  /* ── Contact form ─────────────────────────────────────────── */
  const form       = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("input[required], select[required], textarea[required]").forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = "var(--red-bright)";
          setTimeout(() => { input.style.borderColor = ""; }, 2000);
        }
      });
      if (!valid) return;
      const btn = form.querySelector("button[type=submit]");
      btn.querySelector("span").textContent = "Sending...";
      btn.disabled = true;
      setTimeout(() => { form.style.display = "none"; successMsg.classList.add("show"); }, 1400);
    });
  }

  /* ── Active nav highlight ─────────────────────────────────── */
  const navLinks = document.querySelectorAll(".nav__links a");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute("href") === "#" + id ? "var(--white)" : "";
        });
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("section[id]").forEach(s => sectionObserver.observe(s));

  /* ── Ticker pause on hover ────────────────────────────────── */
  const tickerTrack = document.querySelector(".ticker__track");
  if (tickerTrack) {
    tickerTrack.addEventListener("mouseenter", () => tickerTrack.style.animationPlayState = "paused");
    tickerTrack.addEventListener("mouseleave", () => tickerTrack.style.animationPlayState = "running");
  }

  /* ── Music card 3D tilt ───────────────────────────────────── */
  document.querySelectorAll(".music-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  /* ── Image fallback ───────────────────────────────────────── */
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", function () {
      if (this.src.includes("maxresdefault")) { this.src = this.src.replace("maxresdefault", "hqdefault"); return; }
      this.style.background = "var(--charcoal-3)";
      this.style.opacity = "0.4";
    });
  });

  console.log("%cREMA — Afro-Rave Pioneer", "font-size:24px;font-weight:bold;color:#c0392b;font-family:serif;");

})();
