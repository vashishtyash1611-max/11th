/* ==========================================================================
   GENIUS IAS — contact.js
   Counselling form: inline validation, loading state, localStorage
   persistence, success modal, WhatsApp pre-filled message, URL-param
   prefill (contact.html?course=UPSC%20Foundation%20Program).
   ========================================================================== */
(function () {
  'use strict';

  var GIAS = window.GIAS = window.GIAS || {};
  var icon = GIAS.icon || function () { return ''; };
  var SITE = GIAS.SITE || {};
  var WA_NUMBER = '917027222123'; /* +91 70272 22123 */

  var LS_KEY = 'gias_enquiries';

  var COURSE_OPTIONS = [
    'UPSC', 'HCS', 'CLAT', 'AILET', 'SLAT', 'LSAT', 'NLAT', 'IPM', 'CUET', 'NIOS',
    'School of Humanities', 'School of Commerce'
  ];

  /* ---------------- storage helpers (safe against disabled storage) ------- */
  function readStore() {
    try {
      var raw = window.localStorage.getItem(LS_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
  }
  function writeStore(list) {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(list)); }
    catch (e) { /* storage unavailable — submission still succeeds in-session */ }
  }

  /* ---------------- validation ---------------- */
  var validators = {
    name: function (v) {
      if (!v.trim()) { return 'Please enter your name.'; }
      if (v.trim().length < 2) { return 'Name must be at least 2 characters.'; }
      if (!/^[\p{L}\s.'-]+$/u.test(v.trim())) { return 'Name contains invalid characters.'; }
      return '';
    },
    phone: function (v) {
      var digits = v.replace(/[^\d]/g, '');
      if (!v.trim()) { return 'Please enter your phone number.'; }
      if (!/^[6-9]\d{9}$/.test(digits) && !/^(91)?[6-9]\d{9}$/.test(digits)) {
        return 'Enter a valid 10-digit Indian mobile number.';
      }
      return '';
    },
    email: function (v) {
      if (!v.trim()) { return 'Please enter your email address.'; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) { return 'Enter a valid email address.'; }
      return '';
    },
    course: function (v) {
      if (!v) { return 'Please select a course.'; }
      return '';
    },
    mode: function (v) {
      if (!v) { return 'Please choose a preferred mode.'; }
      return '';
    }
  };

  function setFieldState(input, msg) {
    var group = input.closest('.form-group') || input.closest('.radio-group') || input;
    var errEl = group.parentNode
      ? group.parentNode.querySelector('.field-error[data-for="' + input.name + '"]')
      : null;
    if (!errEl) { errEl = (group.querySelector && group.querySelector('.field-error')) || null; }

    if (msg) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
      if (errEl) {
        errEl.innerHTML = icon('info') + '<span>' + msg + '</span>';
        errEl.classList.add('is-visible');
      }
    } else {
      input.classList.remove('is-invalid');
      if (input.value && input.type !== 'radio') { input.classList.add('is-valid'); }
      input.removeAttribute('aria-invalid');
      if (errEl) { errEl.classList.remove('is-visible'); }
    }
  }

  function setGroupError(form, name, msg) {
    /* radio groups: mark the group container */
    var group = form.querySelector('.radio-group[data-name="' + name + '"]');
    var errEl = form.querySelector('.field-error[data-for="' + name + '"]');
    if (group) { group.classList.toggle('is-invalid', !!msg); }
    if (errEl) {
      if (msg) {
        errEl.innerHTML = icon('info') + '<span>' + msg + '</span>';
        errEl.classList.add('is-visible');
      } else {
        errEl.classList.remove('is-visible');
      }
    }
  }

  /* ---------------- WhatsApp message ---------------- */
  function buildWhatsAppMessage(data) {
    var lines = [
      'Hello Genius IAS | School of Humanities,',
      'I have submitted the counselling form on your website and would like guidance.',
      '',
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      'Course Interest: ' + data.course,
      'Preferred Mode: ' + data.mode
    ];
    if (data.message) {
      lines.push('Message: ' + data.message);
    }
    lines.push('', 'Please contact me for a free counselling session. Thank you!');
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  /* ---------------- success modal ---------------- */
  function ensureSuccessModal() {
    var overlay = document.getElementById('successModal');
    if (overlay) { return overlay; }
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'successModal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="modal" style="max-width:520px;">' +
        '<button class="modal__close" type="button" data-close-modal aria-label="Close dialog">' + icon('x') + '</button>' +
        '<div class="modal__body">' +
          '<div class="success-visual">' +
            '<div class="success-visual__icon">' + icon('check') + '</div>' +
            '<h3>Enquiry Submitted!</h3>' +
            '<p>Thank you for reaching out to Genius IAS | School of Humanities. Our academic counsellors will contact you shortly.</p>' +
          '</div>' +
          '<div class="modal__actions" style="justify-content:center;">' +
            '<a class="whatsapp-btn" id="successWhatsapp" href="#" target="_blank" rel="noopener">' +
              icon('whatsapp') + ' Continue on WhatsApp</a>' +
            '<button type="button" class="btn btn--outline" data-close-modal>Done</button>' +
          '</div>' +
          '<p class="form-note" style="justify-content:center;margin-top:18px;">' +
            icon('phone') +
            '<span>Prefer to talk? Call <a href="tel:' + (SITE.phoneRaw ? SITE.phoneRaw[0] : '') + '" style="color:var(--primary);font-weight:600;">' +
            (SITE.phones ? SITE.phones[0] : '') + '</a></span>' +
          '</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  /* ---------------- general WhatsApp counselling button ---------------- */
  function initGeneralWhatsApp() {
    document.querySelectorAll('[data-whatsapp-general]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var msg = 'Hello Genius IAS | School of Humanities,\n' +
          'I visited your website and would like a free counselling session for your programs.\n' +
          'Please guide me. Thank you!';
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      });
    });
  }

  /* ---------------- main form wiring ---------------- */
  function initForm() {
    var form = document.getElementById('counsellingForm');
    if (!form) { return; }

    /* populate course select */
    var courseSelect = form.querySelector('select[name="course"]');
    if (courseSelect && courseSelect.options.length <= 1) {
      COURSE_OPTIONS.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        courseSelect.appendChild(opt);
      });
    }

    /* URL param prefill: ?course=... &mode=... */
    var params = new URLSearchParams(window.location.search);
    var courseParam = params.get('course');
    if (courseParam && courseSelect) {
      var match = null;
      Array.prototype.forEach.call(courseSelect.options, function (opt) {
        if (opt.value.toLowerCase() === courseParam.toLowerCase()) { match = opt.value; }
      });
      if (!match) {
        /* partial match, e.g. "UPSC Foundation Program" → "UPSC" */
        Array.prototype.forEach.call(courseSelect.options, function (opt) {
          if (!match && opt.value && courseParam.toLowerCase().indexOf(opt.value.toLowerCase()) === 0) {
            match = opt.value;
          }
        });
      }
      if (match) { courseSelect.value = match; }
    }
    var modeParam = params.get('mode');
    if (modeParam) {
      var radio = form.querySelector('input[name="mode"][value="' + modeParam + '"]');
      if (radio) { radio.checked = true; }
    }

    /* live validation on blur/change, clear on input */
    ['name', 'phone', 'email', 'course'].forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      if (!input) { return; }
      var evt = (input.tagName === 'SELECT') ? 'change' : 'blur';
      input.addEventListener(evt, function () {
        setFieldState(input, validators[name](input.value));
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) {
          setFieldState(input, validators[name](input.value));
        }
      });
    });
    form.querySelectorAll('input[name="mode"]').forEach(function (r) {
      r.addEventListener('change', function () { setGroupError(form, 'mode', ''); });
    });

    /* submit */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        name: (form.querySelector('[name="name"]') || {}).value || '',
        phone: (form.querySelector('[name="phone"]') || {}).value || '',
        email: (form.querySelector('[name="email"]') || {}).value || '',
        course: (form.querySelector('[name="course"]') || {}).value || '',
        mode: (form.querySelector('input[name="mode"]:checked') || {}).value || '',
        message: (form.querySelector('[name="message"]') || {}).value || '',
        submittedAt: new Date().toISOString()
      };

      /* validate all */
      var errors = {
        name: validators.name(data.name),
        phone: validators.phone(data.phone),
        email: validators.email(data.email),
        course: validators.course(data.course),
        mode: validators.mode(data.mode)
      };
      setFieldState(form.querySelector('[name="name"]'), errors.name);
      setFieldState(form.querySelector('[name="phone"]'), errors.phone);
      setFieldState(form.querySelector('[name="email"]'), errors.email);
      setFieldState(form.querySelector('[name="course"]'), errors.course);
      setGroupError(form, 'mode', errors.mode);

      var firstError = Object.keys(errors).find(function (k) { return errors[k]; });
      if (firstError) {
        var focusTarget = form.querySelector('[name="' + firstError + '"]');
        if (focusTarget) { focusTarget.focus(); }
        if (GIAS.toast) { GIAS.toast('Please fix the highlighted fields.'); }
        return;
      }

      /* loading state */
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      /* simulate async submission (frontend-only) */
      window.setTimeout(function () {
        /* persist */
        var list = readStore();
        list.push(data);
        writeStore(list);

        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(function (el) {
          el.classList.remove('is-valid', 'is-invalid');
        });

        /* success modal with WhatsApp deep link */
        var overlay = ensureSuccessModal();
        var wa = overlay.querySelector('#successWhatsapp');
        if (wa) { wa.href = buildWhatsAppMessage(data); }
        GIAS.openModal(overlay);
      }, 1100);
    });
  }

  function init() {
    initForm();
    initGeneralWhatsApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
