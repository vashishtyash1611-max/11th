/* ==========================================================================
   GENIUS IAS — main.js
   Global behaviors: preloader, scroll progress, back-to-top, reveal
   observer, counters, magnetic buttons, tilt, cursor glow, media error
   handling, toasts, generic modal helpers, hash scroll-on-load.
   ========================================================================== */
(function () {
  'use strict';

  var GIAS = window.GIAS = window.GIAS || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  GIAS.reducedMotion = reduced;

  /* ======================================================================
     1. Preloader — hides as soon as the page is interactive
     ====================================================================== */
  function initPreloader() {
    var pre = document.getElementById('preloader');
    if (!pre) { return; }
    var minDelay = reduced ? 0 : 450; /* brief brand moment */
    var started = Date.now();

    function hide() {
      var wait = Math.max(0, minDelay - (Date.now() - started));
      window.setTimeout(function () {
        pre.classList.add('is-hidden');
        pre.setAttribute('aria-hidden', 'true');
        window.setTimeout(function () {
          if (pre.parentNode) { pre.parentNode.removeChild(pre); }
        }, 700);
      }, wait);
    }

    if (document.readyState === 'complete') { hide(); }
    else {
      window.addEventListener('load', hide);
      /* safety net — never trap the user behind the loader */
      window.setTimeout(hide, 3500);
    }
  }

  /* ======================================================================
     2. Scroll progress bar + back-to-top
     ====================================================================== */
  function initScrollUI() {
    /* progress bar */
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<div class="scroll-progress__bar" id="scrollProgressBar"></div>';
    document.body.appendChild(progress);
    var bar = document.getElementById('scrollProgressBar');

    /* back-to-top */
    var btt = document.createElement('button');
    btt.type = 'button';
    btt.className = 'back-to-top';
    btt.id = 'backToTop';
    btt.setAttribute('aria-label', 'Back to top');
    btt.innerHTML = GIAS.icon ? GIAS.icon('arrow-up') : '&#8593;';
    document.body.appendChild(btt);
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });

    /* cursor glow (desktop only) */
    var glow = null;
    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.id = 'cursorGlow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
      var gx = 0, gy = 0, cx = 0, cy = 0, glowRaf = null;
      document.addEventListener('mousemove', function (e) {
        gx = e.clientX; gy = e.clientY;
        if (!glow.classList.contains('is-active')) { glow.classList.add('is-active'); }
        if (!glowRaf) {
          glowRaf = window.requestAnimationFrame(function loop() {
            cx += (gx - cx) * 0.12;
            cy += (gy - cy) * 0.12;
            glow.style.transform = 'translate(' + (cx - 210) + 'px,' + (cy - 210) + 'px)';
            glowRaf = (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5)
              ? window.requestAnimationFrame(loop) : null;
          });
        }
      }, { passive: true });
    }

    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
      if (bar) { bar.style.width = pct + '%'; }
      if (btt) { btt.classList.toggle('is-visible', y > 600); }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ======================================================================
     3. Scroll reveal (IntersectionObserver)
     ====================================================================== */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal], .stagger, .journey, .roadmap, .footer');
    if (!items.length) { return; }

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('is-revealed', 'is-inview');
        if (el.classList.contains('stagger')) {
          Array.prototype.forEach.call(el.children, function (c) { c.style.opacity = '1'; });
        }
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        el.classList.add('is-revealed');
        if (el.classList.contains('journey') || el.classList.contains('roadmap') || el.classList.contains('footer')) {
          el.classList.add('is-inview');
        }
        /* trigger counters inside */
        el.querySelectorAll('[data-count]').forEach(animateCounter);
        if (el.hasAttribute('data-count')) { animateCounter(el); }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });

    /* also observe standalone counters */
    document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     4. Number counters
     ====================================================================== */
  function animateCounter(el) {
    if (!el || el.dataset.counted === 'true') { return; }
    el.dataset.counted = 'true';
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) { return; }
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var dur = reduced ? 0 : 1600;
    var start = null;

    function fmt(v) { return prefix + v.toFixed(decimals) + suffix; }
    if (dur === 0) { el.textContent = fmt(target); return; }

    function step(ts) {
      if (!start) { start = ts; }
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
      el.textContent = fmt(target * eased);
      if (p < 1) { window.requestAnimationFrame(step); }
      else { el.textContent = fmt(target); }
    }
    window.requestAnimationFrame(step);
  }
  GIAS.animateCounter = animateCounter;

  /* ======================================================================
     5. Magnetic buttons (desktop, subtle)
     ====================================================================== */
  function initMagnetic() {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) { return; }
    document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = 'translate(' + (dx * 7).toFixed(2) + 'px,' + (dy * 5 - 3).toFixed(2) + 'px)';
      }, { passive: true });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ======================================================================
     6. Lightweight tilt (data-tilt) — desktop only
     ====================================================================== */
  function initTilt() {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) { return; }
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var max = parseFloat(card.getAttribute('data-tilt')) || 5;
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-py * max).toFixed(2) +
          'deg) rotateY(' + (px * max).toFixed(2) + 'deg) translateY(-6px)';
      }, { passive: true });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ======================================================================
     7. Media error handling (images & videos)
     ====================================================================== */
  function initMediaGuards() {
    /* broken images → hide gracefully (alt text remains for a11y) */
    document.querySelectorAll('img').forEach(function (img) {
      if (img.dataset.guarded === 'true') { return; }
      img.dataset.guarded = 'true';
      img.addEventListener('error', function () {
        img.classList.add('img-failed');
        img.style.visibility = 'hidden';
      });
    });
    /* videos: if playback fails, reveal poster fallback and never break layout */
    document.querySelectorAll('video').forEach(function (v) {
      v.addEventListener('error', function () {
        v.style.display = 'none';
        var fallback = v.parentNode ? v.parentNode.querySelector('[data-video-fallback]') : null;
        if (fallback) { fallback.style.display = 'grid'; }
      }, true);
    });
  }

  /* ======================================================================
     8. Toast helper
     ====================================================================== */
  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('giasToast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.id = 'giasToast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.innerHTML = (GIAS.icon ? GIAS.icon('check-circle') : '') + '<span>' + msg + '</span>';
    /* force reflow for re-trigger */
    t.classList.remove('is-visible');
    void t.offsetWidth;
    t.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.classList.remove('is-visible'); }, 3600);
  }
  GIAS.toast = toast;

  /* ======================================================================
     9. Generic modal helper (used by courses / faculty / portal)
     ====================================================================== */
  function openModal(overlayEl) {
    if (!overlayEl) { return; }
    overlayEl.classList.add('is-open');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    var focusable = overlayEl.querySelector('button, [href], input, select, textarea');
    if (focusable) { window.setTimeout(function () { focusable.focus(); }, 80); }
  }

  function closeModal(overlayEl) {
    if (!overlayEl) { return; }
    overlayEl.classList.remove('is-open');
    overlayEl.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-overlay.is-open') &&
        !document.querySelector('.mobile-menu.is-open')) {
      document.body.classList.remove('no-scroll');
    }
  }

  /* wire every [data-close-modal] button + overlay click + ESC */
  function initModals() {
    document.addEventListener('click', function (e) {
      /* open any modal by id: [data-open-modal="#facultyModalVineet"] */
      var openBtn = e.target.closest('[data-open-modal]');
      if (openBtn) {
        var target = document.querySelector(openBtn.getAttribute('data-open-modal'));
        if (target) { openModal(target); }
        return;
      }
      var closeBtn = e.target.closest('[data-close-modal]');
      if (closeBtn) {
        var overlay = closeBtn.closest('.modal-overlay');
        if (overlay) { closeModal(overlay); }
        return;
      }
      if (e.target.classList && e.target.classList.contains('modal-overlay') && e.target.classList.contains('is-open')) {
        closeModal(e.target);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
    });
  }
  GIAS.openModal = openModal;
  GIAS.closeModal = closeModal;

  /* ======================================================================
     10. Hash scroll on load (e.g. upsc.html#foundation, contact.html#counselling-form)
     ====================================================================== */
  function initHashScroll() {
    if (!window.location.hash) { return; }
    var tryScroll = function (attempts) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        window.setTimeout(function () {
          target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }, 250);
      } else if (attempts > 0) {
        window.setTimeout(function () { tryScroll(attempts - 1); }, 200);
      }
    };
    tryScroll(5);
  }

  /* ======================================================================
     11. Expandable panels (shared component on program pages)
     ====================================================================== */
  function initExpandables() {
    document.querySelectorAll('.expandable__toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panelId = btn.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) { return; }
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        panel.classList.toggle('is-open', !open);
      });
    });

    /* Standalone FAQ teasers on program pages (faq.html owns #faqList via faq.js) */
    document.querySelectorAll('.faq-item__q').forEach(function (btn) {
      if (btn.closest('#faqList')) { return; }
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        if (!item) { return; }
        var list = item.closest('.faq-list') || document;
        var isOpen = item.classList.contains('is-open');
        list.querySelectorAll('.faq-item.is-open').forEach(function (open) {
          open.classList.remove('is-open');
          var b = open.querySelector('.faq-item__q');
          if (b) { b.setAttribute('aria-expanded', 'false'); }
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  function init() {
    initPreloader();
    initScrollUI();
    initReveal();
    initMagnetic();
    initTilt();
    initMediaGuards();
    initModals();
    initExpandables();
    initHashScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
