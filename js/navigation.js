/* ==========================================================================
   GENIUS IAS — navigation.js
   Shared components: icons, topbar, navbar, mobile menu, footer,
   legal modals, scroll state, active links, page transitions.
   Loaded first on every page (deferred).
   ========================================================================== */
(function () {
  'use strict';

  window.GIAS = window.GIAS || {};

  /* ---------------- Site data (source: geniusias.com) ---------------- */
  var SITE = {
    name: 'Genius IAS',
    school: 'School of Humanities',
    addressLines: [
      '3rd floor, Near Sheila Bypass Rd,',
      'above Bank of Baroda Building,',
      'Model Town, Rohtak'
    ],
    addressFull: '3rd floor, Near Sheila Bypass Rd, above Bank of Baroda Building, Model Town, Rohtak',
    phones: ['+91 70272 22123', '+91 70272 22124'],
    phoneRaw: ['+917027222123', '+917027222124'],
    email: 'geniusiasofficial@gmail.com',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Genius IAS, Model Town, Rohtak'),
    social: {
      youtubeGIAS: 'https://www.youtube.com/channel/UC2z3jBDqL3z2QKXGaZvjNug',
      instagramGIAS: 'https://www.instagram.com/geniusias/',
      youtubeSOH: 'https://www.youtube.com/@Schoolofhumanitiesofficial',
      instagramSOH: 'https://www.instagram.com/school_of_humanities_official?igsh=ZGxxbzVtc3B2MXZv'
    }
  };
  GIAS.SITE = SITE;

  /* Primary navbar links (spec order) */
  var NAV_LINKS = [
    { label: 'UPSC|HCS', href: 'upsc-hcs.html', page: 'upsc-hcs' },
    { label: 'CLAT', href: 'clat.html', page: 'clat' },
    { label: 'IPM', href: 'ipm.html', page: 'ipm' },
    { label: 'CUET', href: 'cuet.html', page: 'cuet' },
    { label: 'NIOS', href: 'nios.html', page: 'nios' }
  ];
  GIAS.NAV_LINKS = NAV_LINKS;

  /* Full page map (used by mobile menu & footer) */
  var PAGES = {
    home: { label: 'Home', href: 'index.html' },
    about: { label: 'About Us', href: 'about.html' },
    courses: { label: 'Courses', href: 'courses.html' },
    'upsc-hcs': { label: 'UPSC|HCS', href: 'upsc-hcs.html' },
    upsc: { label: 'UPSC', href: 'upsc-hcs.html#upsc' },
    hcs: { label: 'HCS', href: 'upsc-hcs.html#hcs' },
    clat: { label: 'CLAT', href: 'clat.html' },
    ipm: { label: 'IPM', href: 'ipm.html' },
    cuet: { label: 'CUET', href: 'cuet.html' },
    nios: { label: 'NIOS', href: 'nios.html' },
    humanities: { label: 'School of Humanities', href: 'school-of-humanities.html' },
    commerce: { label: 'School of Commerce', href: 'school-of-commerce.html' },
    faculty: { label: 'Mentors', href: 'faculty.html' },
    results: { label: 'Results', href: 'results.html' },
    faq: { label: 'FAQ', href: 'faq.html' },
    contact: { label: 'Contact', href: 'contact.html' }
  };
  GIAS.PAGES = PAGES;

  /* ---------------- Inline SVG icon set (24×24, stroke style) ---------------- */
  var PATHS = {
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up': '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
    'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'user-tie': '<circle cx="12" cy="6" r="3.4"/><path d="M12 10.5 9.8 14l2.2 7 2.2-7-2.2-3.5z"/><path d="M5 21v-1.6A4.4 4.4 0 0 1 9.4 15h.9M19 21v-1.6a4.4 4.4 0 0 0-4.4-4.4h-.9"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 14 2 2 4-4"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    mic: '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    award: '<circle cx="12" cy="8" r="6"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12.5V17c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8v-4.5"/><line x1="22" y1="10" x2="22" y2="16"/>',
    landmark: '<path d="M12 3 2 8h20L12 3z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M2 21h20"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="m19 15 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/>',
    trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    headset: '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M20 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h3v4zM4 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H4v4z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    menu: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    /* filled brand icons */
    whatsapp: '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.19.05-.37-.03-.52-.07-.14-.66-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.28.18-1.41-.08-.13-.28-.2-.58-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.54 4.14 1.58 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><path d="M17.4 6.6h.01"/>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/>'
  };

  function icon(name, cls) {
    var p = PATHS[name];
    if (!p) { return ''; }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : '') + '>' + p + '</svg>';
  }
  GIAS.icon = icon;

  /* current page file name, e.g. "upsc" for upsc.html */
  function currentPage() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace(/\.html$/, '') || 'index';
  }
  GIAS.currentPage = currentPage;

  var page = currentPage();

  /* ---------------- Topbar ---------------- */
  function renderTopbar() {
    var el = document.createElement('div');
    el.className = 'topbar';
    el.id = 'topbar';
    el.innerHTML =
      '<div class="topbar__inner">' +
        '<div class="topbar__contacts">' +
          '<a class="topbar__item" href="tel:' + SITE.phoneRaw[0] + '">' + icon('phone') + '<span>' + SITE.phones[0] + '</span></a>' +
          '<a class="topbar__item" href="tel:' + SITE.phoneRaw[1] + '">' + icon('phone') + '<span>' + SITE.phones[1] + '</span></a>' +
          '<a class="topbar__item topbar__item--email" href="mailto:' + SITE.email + '">' + icon('mail') + '<span>' + SITE.email + '</span></a>' +
        '</div>' +
        '<div class="topbar__links">' +
          '<a href="courses.html" class="topbar__page-link">All Courses</a>' +
          '<a href="results.html" class="topbar__page-link">Results</a>' +
          '<div class="topbar__social">' +
            '<a href="' + SITE.social.instagramGIAS + '" target="_blank" rel="noopener" aria-label="Genius IAS on Instagram">' + icon('instagram') + '</a>' +
            '<a href="' + SITE.social.youtubeGIAS + '" target="_blank" rel="noopener" aria-label="Genius IAS on YouTube">' + icon('youtube') + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.prepend(el);
  }

  /* ---------------- Navbar ---------------- */
  function logoHTML(href) {
    return '<a class="navbar__logo" href="' + href + '" aria-label="Genius IAS — home">' +
      '<img class="navbar__logo-img" src="images/logo.jpeg" alt="Genius IAS logo" width="220" height="56">' +
    '</a>';
  }

  function renderNavbar() {
    var header = document.createElement('header');
    header.className = 'navbar';
    header.id = 'navbar';

    var links = NAV_LINKS.map(function (l) {
      var sub = (l.page === 'nios') ? '' : '<small class="navbar__link-sub" aria-hidden="true">Mentors</small>';
      return '<li><a class="navbar__link' + ((page === l.page) ? ' is-active' : '') + '" href="' + l.href + '"' +
        ((page === l.page) ? ' aria-current="page"' : '') + '><span class="navbar__link-label">' + l.label + '</span>' +
        sub + '</a></li>';
    }).join('');

    header.innerHTML =
      '<div class="navbar__inner">' +
        logoHTML('index.html') +
        '<nav class="navbar__nav" aria-label="Primary navigation">' +
          '<ul class="navbar__list">' + links + '</ul>' +
        '</nav>' +
        '<div class="navbar__actions">' +
          '<a class="btn btn--gold btn--sm navbar__cta btn-magnetic" href="contact.html#counselling-form">Free Counselling</a>' +
          '<button class="hamburger" id="hamburger" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>';

    var topbar = document.getElementById('topbar');
    if (topbar) { topbar.insertAdjacentElement('afterend', header); }
    else { document.body.prepend(header); }
  }

  /* ---------------- Mobile menu ---------------- */
  function renderMobileMenu() {
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Site navigation');

    var programs = ['upsc-hcs', 'clat', 'ipm', 'cuet', 'nios'];
    var institute = ['home', 'about', 'courses', 'commerce', 'faculty', 'results', 'faq', 'contact'];

    function linkHTML(key, idx) {
      var p = PAGES[key];
      var isActive = (page === key) || (key === 'home' && page === 'index');
      return '<a class="mobile-menu__link' + (isActive ? ' is-active' : '') + '" href="' + p.href + '"' +
        (isActive ? ' aria-current="page"' : '') + ' data-idx="' + idx + '">' +
        p.label + '<small>' + (isActive ? 'Current' : 'Explore') + '</small></a>';
    }

    var idx = 0;
    var programLinks = programs.map(function (k) { return linkHTML(k, idx++); }).join('');
    var instituteLinks = institute.map(function (k) { return linkHTML(k, idx++); }).join('');

    menu.innerHTML =
      '<div class="mobile-menu__head">' +
        logoHTML('index.html') +
        '<button class="mobile-menu__close" id="mobileMenuClose" type="button" aria-label="Close navigation menu">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="mobile-menu__body">' +
        '<nav class="mobile-menu__nav" aria-label="Programs">' +
          '<span class="label" style="color:var(--accent);margin-bottom:6px;">Programs</span>' + programLinks +
        '</nav>' +
        '<nav class="mobile-menu__nav" aria-label="Institute">' +
          '<span class="label" style="color:var(--accent);margin-bottom:6px;">Institute</span>' + instituteLinks +
        '</nav>' +
        '<div class="mobile-menu__cta">' +
          '<a class="btn btn--gold btn--lg btn--block" href="contact.html#counselling-form">Free Counselling</a>' +
        '</div>' +
        '<div class="mobile-menu__contact">' +
          '<a href="tel:' + SITE.phoneRaw[0] + '">' + icon('phone') + SITE.phones[0] + '</a>' +
          '<a href="tel:' + SITE.phoneRaw[1] + '">' + icon('phone') + SITE.phones[1] + '</a>' +
          '<a href="mailto:' + SITE.email + '">' + icon('mail') + SITE.email + '</a>' +
          '<a href="' + SITE.mapsUrl + '" target="_blank" rel="noopener">' + icon('pin') + 'Model Town, Rohtak</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(menu);

    /* stagger delays */
    menu.querySelectorAll('.mobile-menu__link').forEach(function (link, i) {
      link.style.transitionDelay = (0.05 + i * 0.045) + 's';
    });

    /* open / close logic */
    var hamburger = document.getElementById('hamburger');
    var closeBtn = document.getElementById('mobileMenuClose');
    var lastFocused = null;

    function openMenu() {
      lastFocused = document.activeElement;
      menu.classList.add('is-open');
      document.body.classList.add('no-scroll');
      if (hamburger) { hamburger.setAttribute('aria-expanded', 'true'); }
      window.setTimeout(function () { if (closeBtn) { closeBtn.focus(); } }, 60);
    }
    function closeMenu() {
      menu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        if (lastFocused && document.contains(lastFocused)) { lastFocused.focus(); }
      }
    }
    GIAS.closeMobileMenu = closeMenu;

    if (hamburger) { hamburger.addEventListener('click', openMenu); }
    if (closeBtn) { closeBtn.addEventListener('click', closeMenu); }
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); }
    });
    /* trap focus inside the open menu */
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menu.classList.contains('is-open')) { return; }
      var focusables = menu.querySelectorAll('a, button');
      if (!focusables.length) { return; }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------- Footer ---------------- */
  function footerLink(key) {
    var p = PAGES[key];
    return '<li><a href="' + p.href + '"' + (page === key ? ' aria-current="page"' : '') + '>' + p.label + '</a></li>';
  }

  function renderFooter() {
    var root = document.getElementById('footer-root');
    if (!root) { return; }

    root.innerHTML =
      '<footer class="footer" id="siteFooter">' +
        '<div class="footer__glow" aria-hidden="true"></div>' +
        '<div class="container">' +
          '<div class="footer__grid">' +
            /* brand */
            '<div class="footer__brand">' +
              '<a class="navbar__logo" href="index.html" aria-label="Genius IAS — home">' +
                '<span class="navbar__logo-mark" aria-hidden="true">G</span>' +
              '</a>' +
              '<div class="footer__brand-name">GENIUS IAS</div>' +
              '<p class="footer__brand-tag">“Your Journey to Civil Services Starts Here.”</p>' +
              '<p class="footer__brand-desc">Genius IAS | School of Humanities — a Rohtak-based institute offering structured, mentorship-driven preparation for UPSC, HCS, CLAT, IPM and CUET, plus a school-integrated program for Class 11th &amp; 12th. Online and offline modes available.</p>' +
              '<div class="footer__social">' +
                '<a href="' + SITE.social.instagramGIAS + '" target="_blank" rel="noopener" aria-label="Genius IAS on Instagram (opens in new tab)">' + icon('instagram') + '</a>' +
                '<a href="' + SITE.social.youtubeGIAS + '" target="_blank" rel="noopener" aria-label="Genius IAS on YouTube (opens in new tab)">' + icon('youtube') + '</a>' +
                '<a href="' + SITE.social.instagramSOH + '" target="_blank" rel="noopener" aria-label="School of Humanities on Instagram (opens in new tab)">' + icon('instagram') + '</a>' +
                '<a href="' + SITE.social.youtubeSOH + '" target="_blank" rel="noopener" aria-label="School of Humanities on YouTube (opens in new tab)">' + icon('youtube') + '</a>' +
              '</div>' +
            '</div>' +
            /* programs */
            '<nav class="footer__col" aria-label="Programs">' +
              '<h3 class="footer__col-title">Programs</h3>' +
              '<ul class="footer__links">' +
                footerLink('upsc') + footerLink('hcs') + footerLink('clat') +
                footerLink('ipm') + footerLink('cuet') + footerLink('nios') + footerLink('humanities') + footerLink('commerce') +
              '</ul>' +
            '</nav>' +
            /* quick links */
            '<nav class="footer__col" aria-label="Quick links">' +
              '<h3 class="footer__col-title">Quick Links</h3>' +
              '<ul class="footer__links">' +
                footerLink('about') + footerLink('courses') + footerLink('faculty') +
                footerLink('results') + footerLink('faq') + footerLink('contact') +
              '</ul>' +
            '</nav>' +
            /* contact */
            '<div class="footer__col">' +
              '<h3 class="footer__col-title">Contact</h3>' +
              '<div class="footer__contact">' +
                '<div class="footer__contact-item">' + icon('pin') +
                  '<a href="' + SITE.mapsUrl + '" target="_blank" rel="noopener">' + SITE.addressLines.join('<br>') + '</a>' +
                '</div>' +
                '<div class="footer__contact-item">' + icon('phone') +
                  '<span><a href="tel:' + SITE.phoneRaw[0] + '">' + SITE.phones[0] + '</a><br><a href="tel:' + SITE.phoneRaw[1] + '">' + SITE.phones[1] + '</a></span>' +
                '</div>' +
                '<div class="footer__contact-item">' + icon('mail') +
                  '<a href="mailto:' + SITE.email + '">' + SITE.email + '</a>' +
                '</div>' +
                '<a class="btn btn--gold btn--sm" href="contact.html#counselling-form" style="margin-top:6px;align-self:flex-start;">Get Free Counselling</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="footer__bottom">' +
            '<p>&copy; <span id="yearNow">2026</span> Genius IAS | School of Humanities. All rights reserved.</p>' +
            '<div class="footer__legal">' +
              '<button type="button" data-legal="privacy">Privacy Policy</button>' +
              '<button type="button" data-legal="terms">Terms &amp; Conditions</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>';

    var year = document.getElementById('yearNow');
    if (year) { year.textContent = String(new Date().getFullYear()); }
  }

  /* ---------------- Legal modals (Privacy / Terms) ---------------- */
  var LEGAL = {
    privacy: {
      title: 'Privacy Policy',
      body:
        '<h4>Information we collect</h4>' +
        '<p>When you submit the counselling or contact form on this website, we collect the details you provide — your name, phone number, email address, course interest, preferred mode and message — solely to respond to your enquiry.</p>' +
        '<h4>How your information is used</h4>' +
        '<p>Your information is used only for counselling communication regarding Genius IAS | School of Humanities programs. We do not sell or share your personal data with third parties for marketing.</p>' +
        '<h4>Demo storage on this website</h4>' +
        '<p>This website is a frontend implementation. Form submissions are stored locally in your own browser (localStorage) as a demonstration and are not transmitted to any server. You can clear this data at any time from your browser settings.</p>' +
        '<h4>Contact</h4>' +
        '<p>For any privacy-related question, write to <a href="mailto:' + SITE.email + '" style="color:var(--accent);">' + SITE.email + '</a> or call ' + SITE.phones[0] + '.</p>'
    },
    terms: {
      title: 'Terms &amp; Conditions',
      body:
        '<h4>Use of this website</h4>' +
        '<p>This website presents information about the programs offered by Genius IAS | School of Humanities, Rohtak. Program structures, durations and features are indicative; final details, batches and fee structures are shared during counselling.</p>' +
        '<h4>Results &amp; faculty information</h4>' +
        '<p>Results and faculty credentials displayed on this website are based on information available from the referenced Genius IAS sources and are shown for representation.</p>' +
        '<h4>Intellectual property</h4>' +
        '<p>All content, design and branding on this website belong to Genius IAS | School of Humanities and may not be reproduced without permission.</p>'
    }
  };

  function openLegalModal(kind) {
    var data = LEGAL[kind];
    if (!data) { return; }
    var overlay = document.getElementById('legalModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'legalModal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.innerHTML =
        '<div class="modal modal--dark">' +
          '<button class="modal__close" type="button" data-close-modal aria-label="Close dialog">' + icon('x') + '</button>' +
          '<div class="modal__hero"><div class="hero__grid" aria-hidden="true"></div><div class="modal__hero-inner">' +
            '<span class="label">Genius IAS | School of Humanities</span>' +
            '<h3 id="legalModalTitle"></h3>' +
          '</div></div>' +
          '<div class="modal__body" id="legalModalBody"></div>' +
        '</div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.closest('[data-close-modal]')) { closeLegalModal(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) { closeLegalModal(); }
      });
    }
    overlay.querySelector('#legalModalTitle').innerHTML = data.title;
    overlay.querySelector('#legalModalBody').innerHTML = data.body;
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    var closeBtn = overlay.querySelector('.modal__close');
    if (closeBtn) { window.setTimeout(function () { closeBtn.focus(); }, 60); }
  }

  function closeLegalModal() {
    var overlay = document.getElementById('legalModal');
    if (!overlay) { return; }
    overlay.classList.remove('is-open');
    if (!document.querySelector('.modal-overlay.is-open') && !document.querySelector('.mobile-menu.is-open')) {
      document.body.classList.remove('no-scroll');
    }
  }

  function initLegalButtons() {
    document.querySelectorAll('[data-legal]').forEach(function (btn) {
      btn.addEventListener('click', function () { openLegalModal(btn.getAttribute('data-legal')); });
    });
  }

  /* ---------------- Scroll state (navbar / topbar) ---------------- */
  function initScrollState() {
    var navbar = document.getElementById('navbar');
    var topbar = document.getElementById('topbar');
    if (!navbar) { return; }
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var scrolled = y > 50;
      navbar.classList.toggle('is-scrolled', scrolled);
      if (topbar) { topbar.classList.toggle('is-hidden', scrolled); }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------------- Page transitions ---------------- */
  function initPageTransitions() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) { return; }
      var href = link.getAttribute('href') || '';

      /* only intercept internal .html navigations (with optional hash) */
      var isInternal = /^[\w-]+\.html(#.*)?$/.test(href);
      if (!isInternal) { return; }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
      if (link.hasAttribute('download') || link.getAttribute('target') === '_blank') { return; }

      var file = href.split('#')[0];
      var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';

      /* same page + hash → smooth scroll instead of reload */
      if (file === currentPage() + '.html' || (file === 'index.html' && currentPage() === 'index')) {
        if (hash) {
          var target = document.querySelector(hash);
          if (target) {
            e.preventDefault();
            if (GIAS.closeMobileMenu) { GIAS.closeMobileMenu(); }
            target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
            history.replaceState(null, '', file + hash);
            return;
          }
        }
        return; /* same page, no target: allow default */
      }

      e.preventDefault();
      if (GIAS.closeMobileMenu) { GIAS.closeMobileMenu(); }

      var go = function () { window.location.href = href; };
      if (reduced) { go(); return; }

      document.body.classList.add('page-leaving');
      window.setTimeout(go, 320);
    });

    /* entering state */
    if (!reduced) {
      document.body.classList.add('page-entering');
      window.setTimeout(function () { document.body.classList.remove('page-entering'); }, 700);
    }

    /* restore from bfcache cleanly */
    window.addEventListener('pageshow', function () {
      document.body.classList.remove('page-leaving');
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    renderTopbar();
    renderNavbar();
    renderMobileMenu();
    renderFooter();
    initLegalButtons();
    initScrollState();
    initPageTransitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
