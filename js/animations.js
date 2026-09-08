/* ==========================================================================
   GENIUS IAS — animations.js
   Hero particle canvas, floating-card mouse parallax, element parallax,
   GSAP enhancement (optional — degrades to CSS when the CDN is unavailable).
   ========================================================================== */
(function () {
  'use strict';

  var GIAS = window.GIAS = window.GIAS || {};
  var reduced = GIAS.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================
     1. Hero intro — adds .is-ready which triggers the CSS stagger sequence
        (0.2s logo → 0.4s label → 0.6s heading → 0.8s desc → 1.0s CTAs
         → 1.4s float cards → 1.6s particles)
     ====================================================================== */
  function initHeroIntro() {
    var hero = document.querySelector('.hero');
    if (!hero) { return; }
    /* next frame so first paint is stable */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        hero.classList.add('is-ready');
      });
    });
  }

  /* ======================================================================
     2. Particle canvas — soft drifting gold/blue motes (lightweight)
     ====================================================================== */
  function initParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas || !canvas.getContext) { return; }
    if (reduced) { canvas.style.display = 'none'; return; }
    /* particles begin at ~1.6s in the hero sequence */
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 1.2s ease 1.6s';
    window.requestAnimationFrame(function () { canvas.style.opacity = '1'; });

    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var COUNT = window.innerWidth < 768 ? 26 : 46;
    var raf = null;
    var running = true;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.1 + 0.6,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -(Math.random() * 0.28 + 0.06),
          a: Math.random() * 0.5 + 0.15,
          gold: Math.random() < 0.32
        });
      }
    }

    function draw() {
      if (!running) { return; }
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
        if (p.x < -8) { p.x = w + 8; }
        if (p.x > w + 8) { p.x = -8; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? 'rgba(255,201,40,' + p.a + ')'
          : 'rgba(159,184,255,' + p.a + ')';
        ctx.fill();
      }
      raf = window.requestAnimationFrame(draw);
    }

    /* pause when hero is off-screen for performance */
    function observeHero() {
      var hero = canvas.closest('.hero');
      if (!hero || !('IntersectionObserver' in window)) { return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !running) { running = true; draw(); }
          else if (!entry.isIntersecting && running) {
            running = false;
            if (raf) { window.cancelAnimationFrame(raf); raf = null; }
          }
        });
      }, { threshold: 0 });
      io.observe(hero);
    }

    resize(); spawn(); draw(); observeHero();
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () { resize(); spawn(); }, 180);
    }, { passive: true });
  }

  /* ======================================================================
     3. Hero floating cards — mouse parallax + depth
     ====================================================================== */
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero || reduced) { return; }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) { return; }

    var cards = hero.querySelectorAll('.float-card');
    if (!cards.length) { return; }
    var depths = [26, 16, 34, 22];
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;   /* -1 .. 1 */
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) { raf = window.requestAnimationFrame(loop); }
    }, { passive: true });

    function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      cards.forEach(function (card, i) {
        var d = depths[i % depths.length];
        card.style.translate = (cx * d).toFixed(2) + 'px ' + (cy * d * 0.6).toFixed(2) + 'px';
      });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) {
        raf = window.requestAnimationFrame(loop);
      } else { raf = null; }
    }
  }

  /* ======================================================================
     4. Element parallax — [data-parallax="0.12"] subtle scroll movement
     ====================================================================== */
  function initScrollParallax() {
    if (reduced) { return; }
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) { return; }
    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) { return; }
        var offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ======================================================================
     5. GSAP enhancement (optional)
        Used only where it clearly improves quality: hero title lines and
        CTA-band / large heading emphasis. Everything above already works
        without GSAP.
     ====================================================================== */
  function initGSAP() {
    if (reduced || !window.gsap) { return; }
    var gsap = window.gsap;

    /* gentle scale-in on section titles when revealed */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          gsap.fromTo(entry.target,
            { y: 18, opacity: 0.001 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
          );
          io.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('.section--grad .section-title, .cta-band__title').forEach(function (el) {
        io.observe(el);
      });
    }
  }

  function init() {
    initHeroIntro();
    initParticles();
    initHeroParallax();
    initScrollParallax();
    initGSAP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
