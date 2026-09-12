/* ==========================================================================
   GENIUS IAS — courses.js
   Course catalogue data, animated filtering + search on courses.html,
   and the course-detail modal.
   Data sources: UPSC programs → reference site 1 structure; HCS / CLAT /
   IPM / CUET / School programs → geniusias.com positioning. No fees,
   ranks or claims are invented — where details are not published, the
   card points to counselling.
   ========================================================================== */
(function () {
  'use strict';

  var GIAS = window.GIAS = window.GIAS || {};
  var icon = GIAS.icon || function () { return ''; };

  /* ---------------- Catalogue ---------------- */
  var COURSES = [
    {
      id: 'upsc-foundation',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'UPSC CSE Foundation Program',
      duration: '1 Year | 2 Year | 3 Year',
      badges: ['GS + CSAT', 'Prelims + Mains + Interview'],
      desc: 'Foundation track for beginners, fresh graduates and final-year students — complete GS + CSAT from scratch with answer writing, test series and mentorship.',
      features: ['Complete GS (Prelims + Mains) & CSAT from scratch', 'NCERT foundation moving to standard references', 'Daily current affairs, answer & essay writing practice', 'Regular Prelims + Mains test series with analysis', 'Personal mentorship & study plans'],
      page: 'upsc-hcs.html#foundation',
      art: 'art--upsc',
      iconName: 'cap'
    },
    {
      id: 'upsc-regular',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'UPSC Regular Program',
      duration: '10 Months',
      badges: ['Weekday / Weekend', 'Mains Focus'],
      desc: 'Advanced preparation for graduates with integrated Prelims + Mains + Interview coverage and answer-writing mastery.',
      features: ['Weekday / weekend options', 'Integrated Prelims + Mains + Interview', 'Answer writing mastery', 'Current affairs labs', 'Interview grooming'],
      page: 'upsc-hcs.html#regular',
      art: 'art--upsc',
      iconName: 'target'
    },
    {
      id: 'prelims-test-series',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'Prelims Test Series',
      duration: '6 Months',
      badges: ['40+ Tests', 'All India Ranking'],
      desc: 'Intensive test-based revision with 40+ full-length tests, detailed solutions and performance analytics.',
      features: ['40+ tests', 'All India ranking', 'GS & CSAT tests', 'Detailed solutions', 'Performance analytics'],
      page: 'upsc-hcs.html#prelims-test-series',
      art: 'art--gold',
      iconName: 'clipboard'
    },
    {
      id: 'mains-answer-writing',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'Mains Answer Writing',
      duration: '4 Months',
      badges: ['Daily Practice', 'Evaluation'],
      desc: 'Daily answer writing practice with expert evaluation, 1:1 feedback and model answers.',
      features: ['Daily practice', 'Expert evaluation', 'Daily questions', '1:1 feedback', 'Model answers'],
      page: 'upsc-hcs.html#mains-answer-writing',
      art: 'art--gold',
      iconName: 'edit'
    },
    {
      id: 'current-affairs',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'Current Affairs Program',
      duration: 'Year-long',
      badges: ['Daily CA', 'Monthly Magazine'],
      desc: 'Stay ahead with daily news analysis, monthly magazines, editorial discussions and weekly quizzes.',
      features: ['Daily current affairs', 'Monthly magazine', 'The Hindu + Indian Express analysis', 'Monthly compilation', 'Weekly quiz'],
      page: 'upsc-hcs.html#current-affairs',
      art: 'art--upsc',
      iconName: 'globe'
    },
    {
      id: 'interview-guidance',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'Interview Guidance',
      duration: '45 Days',
      badges: ['Mock Interviews', 'DAF Sessions'],
      desc: 'Mock interviews, personalized DAF analysis, panel practice and personality development sessions.',
      features: ['Mock interviews', 'DAF sessions', 'Panel interviews', 'Personality development', 'DAF deep-dive'],
      page: 'upsc-hcs.html#interview-guidance',
      art: 'art--gold',
      iconName: 'mic'
    },
    {
      id: 'hcs-regular',
      cat: 'upsc-hcs',
      catLabel: 'UPSC | HCS',
      title: 'HCS Foundation Program',
      duration: '1 Year | 2 Year | 3 Year',
      badges: ['Prelims + Mains + Interview', 'Mock Interviews'],
      desc: 'Foundation track for HCS beginners, fresh graduates and final-year students — complete GS, Optional & CSAT from scratch with mentorship.',
      features: ['Complete GS (Prelims + Mains) & CSAT from scratch', 'Optional subject coaching by interest and aptitude', 'Daily current affairs, answer & essay writing practice', 'Regular Prelims + Mains test series with analysis', 'Personal mentorship, group discussions & peer learning'],
      page: 'upsc-hcs.html#hcs-regular',
      art: 'art--hcs',
      iconName: 'landmark'
    },
    {
      id: 'clat-prep',
      cat: 'clat',
      catLabel: 'CLAT',
      title: 'CLAT Preparation',
      duration: 'Online & Offline Batches',
      badges: ['Law Entrance', 'School Integrated'],
      desc: 'Structured CLAT preparation covering all exam areas, with mock tests and mentorship — offered through the School of Humanities for Class 11th & 12th students and dedicated aspirants. Batch plans shared on counselling.',
      features: ['Legal aptitude preparation', 'Logical reasoning', 'English language', 'Quantitative techniques', 'Current affairs & general knowledge', 'Mock tests and mentorship'],
      page: 'clat.html',
      art: 'art--clat',
      iconName: 'landmark'
    },
    {
      id: 'ipm-prep',
      cat: 'ipm',
      catLabel: 'IPM',
      title: 'IPM Preparation',
      duration: 'Online & Offline Batches',
      badges: ['Management Entrance', 'Aptitude Focus'],
      desc: 'Preparation for Integrated Programme in Management entrances with a strong aptitude core, mock tests and personalized mentorship. Batch plans shared on counselling.',
      features: ['Quantitative aptitude', 'Verbal ability', 'Logical reasoning', 'Current affairs', 'Mock tests & analysis', 'Mentorship and performance improvement'],
      page: 'ipm.html',
      art: 'art--ipm',
      iconName: 'briefcase'
    },
    {
      id: 'cuet-prep',
      cat: 'cuet',
      catLabel: 'CUET',
      title: 'CUET Preparation',
      duration: 'Online & Offline Batches',
      badges: ['University Entrance', 'Subject + Aptitude'],
      desc: 'CUET preparation combining domain subject coaching with general aptitude, current affairs and a mock-test driven approach, with performance tracking. Batch plans shared on counselling.',
      features: ['Domain subject preparation', 'General aptitude', 'Current affairs & general knowledge', 'Mock tests', 'Mentorship', 'Performance tracking'],
      page: 'cuet.html',
      art: 'art--cuet',
      iconName: 'book-open'
    },
    {
      id: 'soc-program',
      cat: 'commerce',
      catLabel: 'School of Commerce',
      title: 'School of Commerce Program',
      duration: 'Enquire for Details',
      badges: ['Academic Excellence', 'Career Guidance'],
      desc: 'Commerce-stream academics with career guidance, mentorship and student development. Program structure and batch details are shared by our counsellors.',
      features: ['Academic excellence focus', 'Career guidance', 'Mentorship', 'Student development', 'Program details on counselling'],
      page: 'school-of-commerce.html',
      art: 'art--soc',
      iconName: 'building'
    },
    /* ---- Offline classroom batches (same as home screen) ---- */
    {
      id: 'off-upsc-hcs-foundation',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'UPSC | HCS Program',
      duration: 'Classroom · Rohtak',
      badges: ['Offline', 'GS + CSAT'],
      desc: 'Classroom foundation program for UPSC & HCS at the Rohtak campus — daily GS + CSAT teaching with mentorship.',
      features: ['Daily GS + CSAT classroom sessions', 'Complete prelims + mains syllabus coverage', 'Study material with current affairs integration', 'Regular tests with performance feedback', 'Personal mentorship & study plans'],
      page: 'upsc-hcs.html#upsc',
      art: 'art--upsc',
      iconName: 'cap'
    },
    {
      id: 'off-clat-foundation',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'CLAT Foundation Program',
      duration: '2 Year',
      badges: ['Offline', 'Class 11th & 12th'],
      desc: 'Two-year classroom CLAT foundation for Class 11th & 12th students — aptitude built from the basics.',
      features: ['Legal aptitude from basics to advanced', 'Logical reasoning, English & quant training', 'Current affairs & GK updates', 'Regular mock tests with analysis', 'Personal mentorship & doubt clearing'],
      page: 'clat.html',
      art: 'art--clat',
      iconName: 'landmark'
    },
    {
      id: 'off-clat-regular',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'CLAT Regular Program',
      duration: '1 Year',
      badges: ['Offline', 'Law Entrance'],
      desc: 'One-year classroom CLAT program — fast-track syllabus coverage with mock-intensive practice.',
      features: ['Fast-track complete syllabus coverage', 'Legal reasoning & mock-intensive practice', 'English, quant & reasoning drills', 'Current affairs with weekly quizzes', 'Personal mentorship & test feedback'],
      page: 'clat.html',
      art: 'art--clat',
      iconName: 'target'
    },
    {
      id: 'off-ipm-foundation',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'IPM Foundation Program',
      duration: '2 Year',
      badges: ['Offline', 'Class 11th & 12th'],
      desc: 'Two-year classroom IPM foundation for Class 11th & 12th students — quant and verbal from fundamentals.',
      features: ['Quant aptitude built from fundamentals', 'Verbal ability & reading comprehension', 'Logical reasoning & DI practice', 'Regular mocks with performance tracking', 'Personal mentorship & doubt clearing'],
      page: 'ipm.html',
      art: 'art--ipm',
      iconName: 'briefcase'
    },
    {
      id: 'off-ipm-regular',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'IPM Regular Program',
      duration: '1 Year',
      badges: ['Offline', 'Management Entrance'],
      desc: 'One-year classroom IPM program — fast-track quant, verbal and reasoning with full-length mocks.',
      features: ['Fast-track quant + verbal coverage', 'Reasoning shortcuts & problem drills', 'Full-length mocks with analysis', 'Current affairs & interview awareness', 'Personal mentorship & test feedback'],
      page: 'ipm.html',
      art: 'art--ipm',
      iconName: 'chart'
    },
    {
      id: 'off-cuet-foundation',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'CUET Foundation Program',
      duration: '2 Year',
      badges: ['Offline', 'Class 11th & 12th'],
      desc: 'Two-year classroom CUET foundation — NCERT-aligned domain subjects plus aptitude.',
      features: ['Domain subjects + aptitude coverage', 'NCERT-aligned concept building', 'General test & English practice', 'Regular mocks with tracking', 'Personal mentorship & doubt clearing'],
      page: 'cuet.html',
      art: 'art--cuet',
      iconName: 'book-open'
    },
    {
      id: 'off-cuet-regular',
      cat: 'offline',
      catLabel: 'Offline',
      title: 'CUET Regular Program',
      duration: '1 Year',
      badges: ['Offline', 'University Entrance'],
      desc: 'One-year classroom CUET program — fast-track domain revision with PYQ practice and mocks.',
      features: ['Fast-track domain + aptitude revision', 'Chapter-wise tests & PYQ practice', 'Full-length CUET mocks with analysis', 'Current affairs & GK support', 'Personal mentorship & test feedback'],
      page: 'cuet.html',
      art: 'art--cuet',
      iconName: 'edit'
    },
    /* ---- Online batches (same as home screen) ---- */
    {
      id: 'on-upsc-hcs-foundation',
      cat: 'online',
      catLabel: 'Online',
      title: 'UPSC | HCS Program',
      duration: '1000+ Videos',
      badges: ['Online', 'GS + CSAT'],
      desc: 'Online UPSC & HCS foundation with 1000+ recorded GS + CSAT lessons, live doubt sessions and mentorship.',
      features: ['1000+ recorded GS + CSAT video lessons', 'Live doubt-clearing sessions', 'Digital study material & current affairs', 'Online tests with performance analytics', 'Personal mentorship & study plans'],
      page: 'upsc-hcs.html#upsc',
      art: 'art--upsc',
      iconName: 'cap'
    },
    {
      id: 'on-clat-foundation',
      cat: 'online',
      catLabel: 'Online',
      title: 'CLAT Foundation Program',
      duration: '2 Year · 1500+ Videos',
      badges: ['Online', 'Class 11th & 12th'],
      desc: 'Two-year online CLAT foundation with 1500+ recorded lessons, live doubts and online mocks.',
      features: ['1500+ recorded video lessons', 'Legal aptitude from basics to advanced', 'Live doubt-clearing sessions', 'Online mocks with detailed analysis', 'Personal mentorship & tracking'],
      page: 'clat.html',
      art: 'art--clat',
      iconName: 'landmark'
    },
    {
      id: 'on-clat-regular',
      cat: 'online',
      catLabel: 'Online',
      title: 'CLAT Regular Program',
      duration: '1 Year · 800+ Videos',
      badges: ['Online', 'Law Entrance'],
      desc: 'One-year online CLAT program with 800+ focused lessons and mock-based performance analysis.',
      features: ['800+ focused video lessons', 'Fast-track complete syllabus coverage', 'Live doubt-clearing sessions', 'Online mocks with performance analysis', 'Personal mentorship & test feedback'],
      page: 'clat.html',
      art: 'art--clat',
      iconName: 'target'
    },
    {
      id: 'on-ipm-foundation',
      cat: 'online',
      catLabel: 'Online',
      title: 'IPM Foundation Program',
      duration: '2 Year · 1500+ Videos',
      badges: ['Online', 'Class 11th & 12th'],
      desc: 'Two-year online IPM foundation with 1500+ lessons across quant, verbal and reasoning.',
      features: ['1500+ recorded video lessons', 'Quant built from fundamentals', 'Verbal & reasoning video drills', 'Online mocks with tracking', 'Personal mentorship & doubt support'],
      page: 'ipm.html',
      art: 'art--ipm',
      iconName: 'briefcase'
    },
    {
      id: 'on-ipm-regular',
      cat: 'online',
      catLabel: 'Online',
      title: 'IPM Regular Program',
      duration: '1 Year · 800+ Videos',
      badges: ['Online', 'Management Entrance'],
      desc: 'One-year online IPM program with 800+ focused lessons, shortcuts and online mocks.',
      features: ['800+ focused video lessons', 'Fast-track quant + verbal coverage', 'Reasoning shortcuts & practice sets', 'Online mocks with analysis', 'Personal mentorship & test feedback'],
      page: 'ipm.html',
      art: 'art--ipm',
      iconName: 'chart'
    },
    {
      id: 'on-cuet-foundation',
      cat: 'online',
      catLabel: 'Online',
      title: 'CUET Foundation Program',
      duration: '2 Year · 1500+ Videos',
      badges: ['Online', 'Class 11th & 12th'],
      desc: 'Two-year online CUET foundation with 1500+ NCERT-aligned domain and aptitude lessons.',
      features: ['1500+ recorded video lessons', 'NCERT-aligned domain concept videos', 'Aptitude & English practice sets', 'Online mocks with tracking', 'Personal mentorship & doubt support'],
      page: 'cuet.html',
      art: 'art--cuet',
      iconName: 'book-open'
    },
    {
      id: 'on-cuet-regular',
      cat: 'online',
      catLabel: 'Online',
      title: 'CUET Regular Program',
      duration: '1 Year · 800+ Videos',
      badges: ['Online', 'University Entrance'],
      desc: 'One-year online CUET program with 800+ revision videos, PYQ practice and full-length mocks.',
      features: ['800+ focused revision videos', 'Chapter-wise tests & PYQ practice', 'Full-length online mocks', 'Live doubt-clearing sessions', 'Personal mentorship & test feedback'],
      page: 'cuet.html',
      art: 'art--cuet',
      iconName: 'edit'
    },
    /* ---- Test series (same as home screen) ---- */
    {
      id: 'ts-prelims',
      cat: 'testseries',
      catLabel: 'Test Series',
      title: 'Prelims Test Series',
      duration: 'Valid for 1 Year',
      badges: ['All India Ranking'],
      desc: 'GS + CSAT prelims test series with All-India ranking, solutions and analytics — valid for one year.',
      features: ['GS + CSAT full-length tests', 'All-India ranking on every test', 'Detailed solutions & explanations', 'Performance analytics & tracking', 'Valid for 1 year from enrolment'],
      page: 'upsc-hcs.html#prelims-test-series',
      art: 'art--gold',
      iconName: 'clipboard'
    },
    {
      id: 'ts-mains',
      cat: 'testseries',
      catLabel: 'Test Series',
      title: 'Mains Test Series',
      duration: 'Valid for 1 Year',
      badges: ['Evaluated Answers'],
      desc: 'Mains answer-writing test series with expert evaluation, 1:1 feedback and model answers — valid for one year.',
      features: ['GS papers answer-writing tests', 'Expert evaluation of every answer', '1:1 feedback & improvement plan', 'Model answers for each test', 'Valid for 1 year from enrolment'],
      page: 'upsc-hcs.html#mains-answer-writing',
      art: 'art--gold',
      iconName: 'edit'
    },
    {
      id: 'ts-clat',
      cat: 'testseries',
      catLabel: 'Test Series',
      title: 'CLAT Test Series',
      duration: 'Valid for 1 Year',
      badges: ['Mock Tests'],
      desc: 'Exam-pattern CLAT mocks with sectional practice and All-India benchmarking — valid for one year.',
      features: ['Exam-pattern full-length mocks', 'Section-wise practice tests', 'Detailed solutions & analysis', 'All-India benchmarking', 'Valid for 1 year from enrolment'],
      page: 'clat.html',
      art: 'art--clat',
      iconName: 'clipboard'
    },
    {
      id: 'ts-ipm',
      cat: 'testseries',
      catLabel: 'Test Series',
      title: 'IPM Test Series',
      duration: 'Valid for 1 Year',
      badges: ['Mock Tests'],
      desc: 'IPM mocks across quant and verbal with shortcuts, analytics and ranking — valid for one year.',
      features: ['Quant + verbal full-length mocks', 'Section-wise practice tests', 'Detailed solutions & shortcuts', 'Performance analytics & ranking', 'Valid for 1 year from enrolment'],
      page: 'ipm.html',
      art: 'art--ipm',
      iconName: 'chart'
    },
    {
      id: 'ts-cuet',
      cat: 'testseries',
      catLabel: 'Test Series',
      title: 'CUET Test Series',
      duration: 'Valid for 1 Year',
      badges: ['Mock Tests'],
      desc: 'CUET domain + aptitude mocks with chapter-wise practice and tracking — valid for one year.',
      features: ['Domain + aptitude full-length mocks', 'Chapter-wise practice tests', 'Detailed solutions & analysis', 'Performance tracking & ranking', 'Valid for 1 year from enrolment'],
      page: 'cuet.html',
      art: 'art--cuet',
      iconName: 'book-open'
    }
  ];
  GIAS.COURSES = COURSES;

  function findCourse(id) {
    for (var i = 0; i < COURSES.length; i++) {
      if (COURSES[i].id === id) { return COURSES[i]; }
    }
    return null;
  }
  GIAS.findCourse = findCourse;

  /* ---------------- Card rendering (courses.html) ---------------- */
  function cardHTML(c, index) {
    var features = c.features.slice(0, 4).map(function (f) {
      return '<li>' + f + '</li>';
    }).join('');
    if (c.features.length > 4) {
      features += '<li>+ ' + (c.features.length - 4) + ' more included</li>';
    }
    return '' +
      '<article class="course-card" data-cat="' + c.cat + '" data-course="' + c.id + '" ' +
        'style="animation-delay:' + (0.05 + index * 0.06).toFixed(2) + 's" ' +
        'data-search="' + (c.title + ' ' + c.catLabel + ' ' + c.desc + ' ' + c.features.join(' ')).toLowerCase().replace(/"/g, '') + '">' +
        '<div class="course-card__media">' +
          '<div class="card-art ' + c.art + '">' + icon(c.iconName) + '</div>' +
          '<span class="badge badge--glass program-card__cat">' + c.catLabel + '</span>' +
        '</div>' +
        '<div class="course-card__body">' +
          '<div class="course-card__head">' +
            '<h3 class="course-card__title">' + c.title + '</h3>' +
            '<span class="course-card__dur">' + icon('clock') + c.duration + '</span>' +
          '</div>' +
          '<p class="course-card__desc">' + c.desc + '</p>' +
          '<ul class="course-card__features">' + features + '</ul>' +
          '<div class="course-card__foot">' +
            '<a class="btn btn--gold btn--sm" href="contact.html?course=' + encodeURIComponent(c.title) + '#counselling-form">' +
              '<span class="btn__label">Enquire</span></a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* ---------------- Detail modal ---------------- */
  function ensureModal() {
    var overlay = document.getElementById('courseModal');
    if (overlay) { return overlay; }
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'courseModal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="modal modal--dark">' +
        '<button class="modal__close" type="button" data-close-modal aria-label="Close course details">' + icon('x') + '</button>' +
        '<div class="modal__hero"><div class="hero__grid" aria-hidden="true"></div>' +
          '<div class="modal__hero-inner">' +
            '<span class="badge" id="cmCat"></span>' +
            '<h3 id="cmTitle"></h3>' +
            '<p id="cmDur"></p>' +
          '</div>' +
        '</div>' +
        '<div class="modal__body">' +
          '<p id="cmDesc"></p>' +
          '<h4>What&rsquo;s included</h4>' +
          '<ul class="check-list" id="cmFeatures"></ul>' +
          '<div class="modal__actions">' +
            '<a class="btn btn--gold" id="cmEnquire" href="contact.html">' +
              '<span class="btn__label">Enquire Now</span>' + icon('arrow-right', 'btn-arrow') + '</a>' +
            '<a class="btn btn--glass" id="cmPage" href="upsc-hcs.html">' +
              '<span class="btn__label">Open Program Page</span>' + icon('arrow-right', 'btn-arrow') + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function openCourseModal(id) {
    var c = findCourse(id);
    if (!c) { return; }
    var overlay = ensureModal();
    overlay.querySelector('#cmCat').textContent = c.catLabel;
    overlay.querySelector('#cmTitle').textContent = c.title;
    overlay.querySelector('#cmDur').innerHTML = icon('clock') + ' &nbsp;' + c.duration +
      (c.badges.length ? ' &nbsp;·&nbsp; ' + c.badges.join(' · ') : '');
    overlay.querySelector('#cmDesc').textContent = c.desc;
    overlay.querySelector('#cmFeatures').innerHTML = c.features.map(function (f) {
      return '<li>' + f + '</li>';
    }).join('');
    overlay.querySelector('#cmEnquire').href =
      'contact.html?course=' + encodeURIComponent(c.title) + '#counselling-form';
    overlay.querySelector('#cmPage').href = c.page;
    GIAS.openModal(overlay);
  }
  GIAS.openCourseModal = openCourseModal;

  /* Categories shown as cards on courses.html (exam detail entries stay
     in the catalogue so View Details modals on program pages keep working) */
  var GRID_CATS = ['offline', 'online', 'testseries', 'commerce'];

  /* ---------------- Filtering + search ---------------- */
  function initCoursesPage() {
    var grid = document.getElementById('courseGrid');
    if (!grid) { return; }

    /* render grid cards only */
    var listed = COURSES.filter(function (c) { return GRID_CATS.indexOf(c.cat) > -1; });
    grid.innerHTML = listed.map(cardHTML).join('');

    var pills = document.querySelectorAll('.filter-pill');
    var searchInput = document.getElementById('courseSearch');
    var clearBtn = document.getElementById('courseSearchClear');
    var emptyState = document.getElementById('coursesEmpty');
    var countEl = document.getElementById('coursesCount');
    var activeCat = 'all';
    var query = '';

    function applyFilters() {
      var cards = grid.querySelectorAll('.course-card');
      var visible = 0;
      cards.forEach(function (card, i) {
        var matchCat = (activeCat === 'all') || (card.getAttribute('data-cat') === activeCat);
        var matchQuery = !query || (card.getAttribute('data-search') || '').indexOf(query) > -1;
        var show = matchCat && matchQuery;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible++;
          /* re-trigger entrance with a light stagger */
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
          card.style.animationDelay = (visible * 0.05).toFixed(2) + 's';
        }
      });
      if (emptyState) { emptyState.classList.toggle('is-visible', visible === 0); }
      if (countEl) {
        var activePill = grid.parentNode.querySelector('.filter-pill[data-filter="' + activeCat + '"]');
        var activeName = activePill ? activePill.textContent : activeCat.toUpperCase();
        countEl.innerHTML = 'Showing <strong>' + visible + '</strong> of <strong>' + listed.length + '</strong> programs' +
          (activeCat !== 'all' ? ' in <strong>' + activeName + '</strong>' : '') +
          (query ? ' matching “<strong>' + query.replace(/</g, '') + '</strong>”' : '');
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-pressed', 'true');
        activeCat = pill.getAttribute('data-filter') || 'all';
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        query = searchInput.value.trim().toLowerCase();
        if (clearBtn) { clearBtn.classList.toggle('is-visible', query.length > 0); }
        applyFilters();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) { searchInput.value = ''; searchInput.focus(); }
        query = '';
        clearBtn.classList.remove('is-visible');
        applyFilters();
      });
    }

    /* deep-link support: courses.html?cat=clat (legacy upsc/hcs map to upsc-hcs) */
    var params = new URLSearchParams(window.location.search);
    var catParam = (params.get('cat') || '').toLowerCase();
    if (catParam === 'upsc' || catParam === 'hcs') { catParam = 'upsc-hcs'; }
    if (catParam) {
      var target = grid.parentNode.querySelector('.filter-pill[data-filter="' + catParam + '"]');
      if (target) { target.click(); }
    }

    /* view-details buttons (event delegation) */
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view-course]');
      if (btn) { openCourseModal(btn.getAttribute('data-view-course')); }
    });

    applyFilters();
  }

  /* ---------------- Global delegation for [data-view-course] anywhere ---------------- */
  function initGlobalCourseButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view-course]');
      if (btn && !btn.closest('#courseGrid')) {
        openCourseModal(btn.getAttribute('data-view-course'));
      }
    });
  }

  function init() {
    initCoursesPage();
    initGlobalCourseButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
