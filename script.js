/* ============================================================
   REMA — Premium Artist Website | JavaScript
   ============================================================ */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════
     SITE LOADER
     Tracks: images, videos (metadata), fonts, window.load
     Shows progress bar + percentage, then fades out cleanly
  ══════════════════════════════════════════════════════════ */
  const loader    = document.getElementById("site-loader");
  const loaderBar = document.getElementById("loaderBar");
  const loaderPct = document.getElementById("loaderPct");

  let total    = 0;
  let loaded   = 0;
  let resolved = false;

  function setProgress(pct) {
    const clamped = Math.min(100, Math.round(pct));
    if (loaderBar) loaderBar.style.width = clamped + "%";
    if (loaderPct) loaderPct.textContent  = clamped + "%";
  }

  function tick() {
    if (total === 0) return;
    setProgress((loaded / total) * 100);
  }

  function done() {
    if (resolved) return;
    resolved = true;
    setProgress(100);

    setTimeout(() => {
      loader.classList.add("loader-done");
      document.documentElement.classList.remove("is-loading");
      document.documentElement.classList.add("is-loaded");

      // Remove loader from DOM after fade
      setTimeout(() => loader.remove(), 500);
    }, 150);
  }

  // ── Track images ──────────────────────────────────────────
  const images = Array.from(document.querySelectorAll("img"));
  images.forEach(img => {
    if (img.complete) { loaded++; tick(); return; }
    total++;
    img.addEventListener("load",  () => { loaded++; tick(); checkDone(); }, { once: true });
    img.addEventListener("error", () => { loaded++; tick(); checkDone(); }, { once: true });
  });

  // ── Track fonts via document.fonts ────────────────────────
  total++;
  document.fonts.ready.then(() => {
    loaded++;
    tick();
    checkDone();
  });

  // ── window.load = final safety net ────────────────────────
  // Only wait for images + fonts, NOT videos (they lazy-load after)
  total++;
  window.addEventListener("load", () => {
    loaded++;
    tick();
    checkDone();
  }, { once: true });

  // ── Minimum display time (200ms) so loader doesn't flash ──
  const minTime = Date.now();

  function checkDone() {
    if (loaded < total) return;
    const elapsed = Date.now() - minTime;
    const wait    = Math.max(0, 200 - elapsed);
    setTimeout(done, wait);
  }

  // ── Absolute timeout — never block longer than 4s ─────────
  setTimeout(done, 4000);

  // Animate progress bar smoothly even before assets report in
  let fakeProgress = 0;
  const fakeTimer = setInterval(() => {
    if (resolved) { clearInterval(fakeTimer); return; }
    // Crawl to 75% max quickly, real progress takes over from there
    if (fakeProgress < 75) {
      fakeProgress += (75 - fakeProgress) * 0.18;
      if (total === 0) setProgress(fakeProgress);
      else setProgress(Math.max(fakeProgress, (loaded / total) * 100));
    }
  }, 40);

  /* ── Devil Staff Cursor — Dark & Realistic ───────────────── */
  // Use pointer:fine to detect mouse (not touch) — more reliable than hover:none
  const isTouch = !window.matchMedia("(pointer: fine)").matches;

  if (!isTouch) {
    const cursor = document.createElement("div");
    cursor.className = "cursor-main";
    cursor.innerHTML = `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shaftGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#3a0a0a"/>
          <stop offset="40%"  stop-color="#8b1a1a"/>
          <stop offset="100%" stop-color="#2a0505"/>
        </linearGradient>
        <linearGradient id="prongGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#cc2200"/>
          <stop offset="60%"  stop-color="#7a1010"/>
          <stop offset="100%" stop-color="#1a0505"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M21 15 L20 42 L22 42 L23 15 Z" fill="url(#shaftGrad)"/>
      <line x1="21.5" y1="15" x2="21" y2="41" stroke="rgba(200,80,60,0.35)" stroke-width="0.6"/>
      <path d="M21.5 3 L21.5 17" stroke="url(#prongGrad)" stroke-width="2.8" stroke-linecap="round" filter="url(#glow)"/>
      <path d="M21.5 7 C17 5 14 8 14 13 C14 16 16.5 17 18.5 16.5" stroke="url(#prongGrad)" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M21.5 7 C26 5 28 8 28 13 C28 16 25.5 17 23.5 16.5" stroke="url(#prongGrad)" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M14 10 L12 5 L16 9" stroke="#991111" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M28 10 L30 5 L26 9" stroke="#991111" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M21.5 1 L20.5 5 L21.5 4 L22.5 5 Z" fill="#dd2200"/>
      <rect x="16" y="14.5" width="11" height="2" rx="1" fill="#5a1010"/>
      <rect x="17" y="14.8" width="9" height="1.2" rx="0.6" fill="#8b2020"/>
      <ellipse cx="21.5" cy="41.5" rx="2.2" ry="1.4" fill="#3a0808"/>
      <ellipse cx="21.5" cy="41.2" rx="1.4" ry="0.8" fill="#7a1515"/>
      <circle cx="21.5" cy="41.5" r="2.8" fill="rgba(180,20,5,0.18)"/>
    </svg>`;

    // Append directly to documentElement so no parent overflow/stacking clips it
    document.documentElement.appendChild(cursor);

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.documentElement.appendChild(glow);

    // Start hidden, show on first move
    cursor.style.opacity = "0";
    glow.style.opacity   = "0";

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    let lastSmokeX = 0, lastSmokeY = 0;
    let moved = false;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;

      // Show on first move
      if (!moved) {
        moved = true;
        cursor.style.opacity = "1";
        glow.style.opacity   = "1";
      }

      // Position uses left/top (not transform) for performance
      cursor.style.left = mouseX + "px";
      cursor.style.top  = mouseY + "px";

      // Smoke trail every 14px
      const dx = mouseX - lastSmokeX, dy = mouseY - lastSmokeY;
      if (Math.sqrt(dx*dx + dy*dy) > 14) {
        const s = document.createElement("div");
        s.className = "cursor-smoke";
        const sz = Math.random() * 7 + 5;
        s.style.cssText = `left:${mouseX}px;top:${mouseY}px;width:${sz}px;height:${sz}px;background:${Math.random()>0.5?"radial-gradient(circle,rgba(60,5,5,0.55) 0%,transparent 70%)":"radial-gradient(circle,rgba(140,20,10,0.35) 0%,transparent 70%)"};`;
        document.documentElement.appendChild(s);
        setTimeout(() => s.remove(), 900);
        lastSmokeX = mouseX; lastSmokeY = mouseY;
      }
    });

    // Smooth glow lag
    (function animateGlow() {
      glowX += (mouseX - glowX) * 0.06;
      glowY += (mouseY - glowY) * 0.06;
      glow.style.left = glowX + "px";
      glow.style.top  = glowY + "px";
      requestAnimationFrame(animateGlow);
    })();

    // Hover state on clickable elements
    document.addEventListener("mouseover", (e) => {
      const el = e.target.closest("a,button,.music-card,.vid-card,.gallery__item,.impact-stat,.nav__logo,select");
      if (el) cursor.classList.add("is-hovering");
    });
    document.addEventListener("mouseout", (e) => {
      const el = e.target.closest("a,button,.music-card,.vid-card,.gallery__item,.impact-stat,.nav__logo,select");
      if (el) cursor.classList.remove("is-hovering");
    });

    document.addEventListener("mousedown", () => cursor.classList.add("is-clicking"));
    document.addEventListener("mouseup",   () => cursor.classList.remove("is-clicking"));
    document.addEventListener("mouseleave", () => { cursor.style.opacity="0"; glow.style.opacity="0"; });
    document.addEventListener("mouseenter", () => { if(moved){ cursor.style.opacity="1"; glow.style.opacity="1"; } });
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

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add("open");
    burger.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove("open");
    burger.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    menuOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close on backdrop click (clicking outside the ul)
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) closeMenu();
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
