/* ==========================================================================
   GENIUS IAS — slider.js
   Lightweight dependency-free carousel: arrows, dots, swipe, autoplay,
   boundary-safe. Markup contract:
   <div class="slider" data-slider data-autoplay="6000">
     <div class="slider__viewport"><div class="slider__track">
       <div class="slider__slide">…</div> …
     </div></div>
     <div class="slider__controls">
       <button class="slider__arrow slider__arrow--prev" data-prev>‹</button>
       <div class="slider__dots" data-dots></div>
       <button class="slider__arrow slider__arrow--next" data-next>›</button>
     </div>
   </div>
   ========================================================================== */
(function () {
  'use strict';

  var GIAS = window.GIAS = window.GIAS || {};
  var reduced = GIAS.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function Slider(root) {
    this.root = root;
    this.track = root.querySelector('.slider__track');
    this.slides = Array.prototype.slice.call(root.querySelectorAll('.slider__slide'));
    this.prev = root.querySelector('[data-prev]');
    this.next = root.querySelector('[data-next]');
    this.dotsWrap = root.querySelector('[data-dots]');
    this.autoplayMs = parseInt(root.getAttribute('data-autoplay') || '0', 10);
    this.index = 0;
    this.perView = 1;
    this.timer = null;

    if (!this.track || this.slides.length === 0) { return; }

    this.buildDots();
    this.bind();
    this.measure();

    var self = this;
    this._onResize = function () { self.measure(); };
    window.addEventListener('resize', this._onResize, { passive: true });

    if (this.autoplayMs > 0 && !reduced) { this.startAutoplay(); }
  }

  Slider.prototype.pages = function () {
    return Math.max(1, this.slides.length - this.perView + 1);
  };

  Slider.prototype.measure = function () {
    /* perView derived from the first slide's rendered width */
    var first = this.slides[0];
    var trackW = this.track.getBoundingClientRect().width || 1;
    var slideW = first.getBoundingClientRect().width || trackW;
    this.perView = Math.max(1, Math.round(trackW / slideW));
    this.buildDots();
    this.clamp();
    this.update(false);
  };

  Slider.prototype.buildDots = function () {
    if (!this.dotsWrap) { return; }
    var pages = this.pages();
    if (this.dotsWrap.children.length === pages) { return; }
    this.dotsWrap.innerHTML = '';
    var self = this;
    for (var i = 0; i < pages; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', 'Go to slide group ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () { self.goTo(idx); });
      })(i);
      this.dotsWrap.appendChild(dot);
    }
  };

  Slider.prototype.bind = function () {
    var self = this;
    if (this.prev) {
      this.prev.addEventListener('click', function () { self.goTo(self.index - 1); });
    }
    if (this.next) {
      this.next.addEventListener('click', function () { self.goTo(self.index + 1); });
    }

    /* touch swipe */
    var startX = 0, startY = 0, dx = 0, dragging = false, locked = false;
    var track = this.track;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) { return; }
      dragging = true; locked = false;
      startX = e.clientX; startY = e.clientY; dx = 0;
      track.classList.add('is-dragging');
      self.stopAutoplay();
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) { return; }
      var mx = e.clientX - startX;
      var my = e.clientY - startY;
      if (!locked) {
        if (Math.abs(mx) > 6 || Math.abs(my) > 6) {
          locked = Math.abs(mx) > Math.abs(my);
        }
        if (!locked) { return; }
      }
      if (locked && e.cancelable) { e.preventDefault(); }
      dx = mx;
      var slideW = self.slides[0].getBoundingClientRect().width || 1;
      var base = -(self.index * slideW);
      track.style.transform = 'translate3d(' + (base + dx) + 'px,0,0)';
    });
    function endDrag() {
      if (!dragging) { return; }
      dragging = false;
      track.classList.remove('is-dragging');
      track.style.transform = '';
      var threshold = (self.slides[0].getBoundingClientRect().width || 300) * 0.18;
      if (dx < -threshold) { self.goTo(self.index + 1); }
      else if (dx > threshold) { self.goTo(self.index - 1); }
      else { self.update(true); }
      if (self.autoplayMs > 0 && !reduced) { self.startAutoplay(); }
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);

    /* pause autoplay on hover / focus */
    this.root.addEventListener('mouseenter', function () { self.stopAutoplay(); });
    this.root.addEventListener('mouseleave', function () {
      if (self.autoplayMs > 0 && !reduced) { self.startAutoplay(); }
    });
    this.root.addEventListener('focusin', function () { self.stopAutoplay(); });
    this.root.addEventListener('focusout', function () {
      if (self.autoplayMs > 0 && !reduced) { self.startAutoplay(); }
    });

    /* keyboard */
    this.root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { self.goTo(self.index - 1); }
      if (e.key === 'ArrowRight') { self.goTo(self.index + 1); }
    });
  };

  Slider.prototype.clamp = function () {
    var max = this.pages() - 1;
    if (this.index > max) { this.index = max; }
    if (this.index < 0) { this.index = 0; }
  };

  Slider.prototype.goTo = function (i) {
    var max = this.pages() - 1;
    /* boundary-safe: clamp, no infinite wrap */
    this.index = Math.min(max, Math.max(0, i));
    this.update(true);
  };

  Slider.prototype.update = function () {
    var slideW = this.slides[0].getBoundingClientRect().width || 0;
    this.track.style.transform = 'translate3d(' + (-(this.index * slideW)) + 'px,0,0)';
    var max = this.pages() - 1;
    if (this.prev) { this.prev.disabled = this.index <= 0; }
    if (this.next) { this.next.disabled = this.index >= max; }
    if (this.dotsWrap) {
      Array.prototype.forEach.call(this.dotsWrap.children, function (d, i) {
        d.classList.toggle('is-active', i === this.index);
      }, this);
    }
    this.slides.forEach(function (s, i) {
      var active = i >= this.index && i < this.index + this.perView;
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    }, this);
  };

  Slider.prototype.startAutoplay = function () {
    var self = this;
    this.stopAutoplay();
    if (this.pages() <= 1) { return; }
    this.timer = window.setInterval(function () {
      var nextIdx = self.index + 1;
      if (nextIdx > self.pages() - 1) { nextIdx = 0; }
      self.goTo(nextIdx);
    }, this.autoplayMs);
  };

  Slider.prototype.stopAutoplay = function () {
    if (this.timer) { window.clearInterval(this.timer); this.timer = null; }
  };

  function init() {
    var instances = [];
    document.querySelectorAll('[data-slider]').forEach(function (el) {
      try { instances.push(new Slider(el)); }
      catch (err) { /* a broken slider must never break the page */ }
    });
    GIAS.sliders = instances;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
