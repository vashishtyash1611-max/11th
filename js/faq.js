/* ==========================================================================
   GENIUS IAS — faq.js
   Fully functional FAQ: category tabs, accordion (one open at a time,
   smooth height animation, rotating plus icon), live search — no reload.
   Answers are grounded in the reference sources; unpublished details
   (fees, batch timings) point to counselling instead of invented data.
   ========================================================================== */
(function () {
  'use strict';

  var GIAS = window.GIAS = window.GIAS || {};
  var icon = GIAS.icon || function () { return ''; };

  var CATEGORIES = [
    { id: 'upsc', label: 'UPSC' },
    { id: 'hcs', label: 'HCS' },
    { id: 'clat', label: 'CLAT' },
    { id: 'ipm', label: 'IPM' },
    { id: 'cuet', label: 'CUET' },
    { id: 'general', label: 'General' }
  ];

  var FAQS = [
    /* ---------------- UPSC ---------------- */
    { cat: 'upsc', q: 'Which UPSC programs does Genius IAS offer?',
      a: 'Genius IAS offers six UPSC programs: the Foundation Program (12 months), the Regular Program (10 months), the Prelims Test Series (6 months), Mains Answer Writing (4 months), the year-long Current Affairs Program, and Interview Guidance (45 days). Both online and offline coaching options are available.' },
    { cat: 'upsc', q: 'What is included in the UPSC Foundation Program?',
      a: 'The 12-month Foundation Program includes daily classes covering GS and CSAT, complete syllabus coverage, study material and a test series, plus personal mentorship. It is designed to build a strong conceptual base for beginners and college students.' },
    { cat: 'upsc', q: 'How does the Prelims Test Series work?',
      a: 'The 6-month Prelims Test Series includes 40+ tests with All India ranking, dedicated GS and CSAT tests, detailed solutions and performance analytics — intensive, test-based revision for the prelims stage.' },
    { cat: 'upsc', q: 'Does the UPSC Regular Program cover the interview stage as well?',
      a: 'Yes. The 10-month Regular Program is an integrated Prelims + Mains + Interview track with weekday/weekend options, answer-writing mastery, current affairs labs and interview grooming. A dedicated 45-day Interview Guidance program with mock interviews, DAF sessions and panel interviews is also offered.' },
    { cat: 'upsc', q: 'How is current affairs handled in the UPSC programs?',
      a: 'The year-long Current Affairs Program includes daily current affairs, The Hindu and Indian Express analysis, a monthly magazine and compilation, and weekly quizzes. Current affairs labs are also built into the Regular Program.' },
    { cat: 'upsc', q: 'Is coaching available online as well as offline?',
      a: 'Yes. Genius IAS offers both online and offline coaching options to suit different learning preferences.' },
    { cat: 'upsc', q: 'Which is the best UPSC coaching in Rohtak?',
      a: 'Genius IAS in Model Town, Rohtak offers a complete UPSC ecosystem — 12-month Foundation, 10-month Regular Program, Prelims Test Series with All India ranking, Mains answer writing, year-long current affairs and 45-day interview guidance — with personal mentorship in online and offline modes. See the <a href="upsc.html">UPSC programs</a> or book free counselling.' },
    { cat: 'upsc', q: 'Is there a UPSC foundation course for Class 11 and Class 12 students?',
      a: 'Yes. School students can start UPSC foundation preparation during Classes 11 and 12 through the School of Humanities integrated program, which builds the habits and awareness the civil services journey needs alongside school studies. See <a href="school-of-humanities.html">School of Humanities</a> for details.' },

    /* ---------------- HCS ---------------- */
    { cat: 'hcs', q: 'What does the HCS Regular Program include?',
      a: 'The 1-year HCS Regular Program covers Prelims and Mains preparation — GS, Optional subject and CSAT — with regular test series, mock interviews, daily current affairs and editorial discussions, answer writing practice, study material, doubt clearing, personalized mentorship and peer learning through group discussions.' },
    { cat: 'hcs', q: 'Who can join the HCS Regular Program?',
      a: 'The program is open to graduates and final-year students, beginners, intermediate and advanced aspirants, working professionals, and repeat aspirants.' },
    { cat: 'hcs', q: 'Is Optional subject coaching provided for HCS?',
      a: 'Yes — Optional subject coaching is part of the HCS Regular Program, along with dedicated answer writing practice and doubt clearing sessions.' },
    { cat: 'hcs', q: 'Are mock interviews part of HCS preparation?',
      a: 'Yes. The HCS Regular Program includes mock interviews as part of its interview-stage preparation, alongside regular Prelims and Mains test series.' },
    { cat: 'hcs', q: 'Where is the best HCS coaching in Rohtak?',
      a: 'Genius IAS in Model Town, Rohtak runs a 1-year HCS Regular Program covering Prelims and Mains — GS, Optional, CSAT — with test series, mock interviews, daily current affairs, answer writing practice and personal mentorship. See the <a href="hcs.html">HCS program page</a> or book free counselling.' },

    /* ---------------- CLAT ---------------- */
    { cat: 'clat', q: 'How is CLAT preparation structured at Genius IAS?',
      a: 'CLAT preparation covers the exam&rsquo;s key areas — legal aptitude, logical reasoning, English language, quantitative techniques and current affairs — with mock tests and mentorship. For Class 11th and 12th students it is offered as part of the School of Humanities integrated program.' },
    { cat: 'clat', q: 'Can school students prepare for CLAT along with their boards?',
      a: 'Yes. The School of Humanities runs a school-integrated program for Class 11th and 12th students that prepares them for CLAT, IPM, CUET, TISS, SAT, SET and the UPSC Foundation alongside the CBSE curriculum.' },
    { cat: 'clat', q: 'Are mock tests included in CLAT preparation?',
      a: 'Yes, mock tests and mentorship are part of the CLAT preparation approach, helping students build exam temperament and track improvement.' },
    { cat: 'clat', q: 'What are the batch timings and fees for CLAT coaching?',
      a: 'Course fees are listed on the Courses page — Foundation programs ₹1,25,000 + GST, Regular programs ₹75,000 + GST and Test Series ₹25,000 + GST. Batch timings are shared during counselling. Talk to our counsellors on +91 70272 22123 or submit the counselling form and we will get back to you.' },
    { cat: 'clat', q: 'Which is the best CLAT coaching in Rohtak?',
      a: 'CLAT Mentors, powered by Genius IAS, is a dedicated law-entrance institute in Rohtak with student selections in CLAT, AILET, SLAT and other law entrance examinations over the past few years. Preparation covers all five CLAT sections with regular mock tests, performance analysis and personal mentorship. See the <a href="clat.html">CLAT program page</a> or book free counselling to compare batches.' },
    { cat: 'clat', q: 'Is AILET coaching available in Rohtak?',
      a: 'Yes. CLAT Mentors in Rohtak offers focused AILET coaching alongside CLAT preparation, with emphasis on the skills and question patterns relevant to the All India Law Entrance Test for NLU Delhi. Batch details are shared during free counselling — see <a href="clat.html">law entrances</a>.' },

    /* ---------------- IPM ---------------- */
    { cat: 'ipm', q: 'What does IPM preparation at Genius IAS cover?',
      a: 'IPM preparation is built around the aptitude core of management entrances — quantitative aptitude, verbal ability, logical reasoning and current affairs — supported by mock tests, mentorship and structured performance improvement.' },
    { cat: 'ipm', q: 'Can Class 11th and 12th students prepare for IPM with school studies?',
      a: 'Yes. IPM is one of the competitive exams covered by the School of Humanities integrated program for Class 11th and 12th students, alongside the CBSE curriculum.' },
    { cat: 'ipm', q: 'How is progress tracked in the IPM program?',
      a: 'Progress is tracked through regular mock tests and mentorship reviews, with a focus on improving accuracy, speed and section-wise performance. Specific batch plans are shared during counselling.' },
    { cat: 'ipm', q: 'Where can I find IPM coaching in Rohtak?',
      a: 'CLAT Mentors, powered by Genius IAS, offers IPM coaching in Rohtak covering IPMAT Indore, IPMAT Rohtak, JIPMAT and other undergraduate management entrance tests, with structured classes, mock tests and personalised mentorship. See the <a href="ipm.html">IPM program page</a> for details.' },
    { cat: 'ipm', q: 'Is JIPMAT coaching available in Rohtak?',
      a: 'Yes. JIPMAT preparation is part of the IPM program at CLAT Mentors, Rohtak, developing the quantitative, verbal and logical reasoning skills required for the Joint Integrated Programme in Management Admission Test. Batch details are shared during free counselling.' },
    { cat: 'ipm', q: 'Can I prepare for IPMAT after Class 12?',
      a: 'Yes. Students can begin IPM preparation during Classes 11 and 12 alongside school, or after completing Class 12 with a focused plan of concept revision and regular mock tests. Talk to our counsellors to pick the right track.' },

    /* ---------------- CUET ---------------- */
    { cat: 'cuet', q: 'What is included in CUET preparation?',
      a: 'CUET preparation combines domain subject coaching with general aptitude, current affairs and general knowledge, mock tests, mentorship and performance tracking.' },
    { cat: 'cuet', q: 'Can CUET be prepared along with the CBSE curriculum?',
      a: 'Yes. The School of Humanities integrated program for Class 11th and 12th prepares students for CUET along with the CBSE curriculum and other entrances like CLAT, IPM, TISS, SAT and SET.' },
    { cat: 'cuet', q: 'Which subjects and domains are covered for CUET?',
      a: 'Domain coverage depends on each student&rsquo;s subject combination in Class 11th and 12th. Share your subjects with our counsellors and they will map out the right CUET plan for you.' },

    /* ---------------- General ---------------- */
    { cat: 'general', q: 'Where is Genius IAS located?',
      a: 'Genius IAS | School of Humanities is located at 3rd floor, Near Sheila Bypass Rd, above Bank of Baroda Building, Model Town, Rohtak. Both online and offline coaching options are available.' },
    { cat: 'general', q: 'Which exams does Genius IAS prepare students for?',
      a: 'Genius IAS prepares aspirants for UPSC (IAS) and HCS — prelims, mains and interview — as well as CLAT, IPM and CUET through the School of Humanities, and offers UPSC foundation coaching for school and college students.' },
    { cat: 'general', q: 'How can I book a free counselling session?',
      a: 'Submit the counselling form on the Contact page, call +91 70272 22123 or +91 70272 22124, email geniusiasofficial@gmail.com, or use the WhatsApp counselling button — our counsellors will guide you to the right program.' },
    { cat: 'general', q: 'Who are the core faculty at Genius IAS?',
      a: 'The core faculty includes Mr. Vineet Singh — Ph.D (Pursuing) in Public Administration, multiple M.A. degrees, 7-time NET JRF, UPSC/HCS/RAS interviewee and Air Force veteran — and Mr. Puneet Narwal — M.A. Sociology with multiple M.A. specializations, UPSC and HCS interviewee, ex-CL and ex-T.I.M.E. faculty with 14 years of teaching experience. View the Mentors page for full profiles.' }
  ];

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function catLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) { return CATEGORIES[i].label; }
    }
    return id;
  }

  function init() {
    var listEl = document.getElementById('faqList');
    var catsEl = document.getElementById('faqCats');
    var searchEl = document.getElementById('faqSearch');
    var clearEl = document.getElementById('faqSearchClear');
    var countEl = document.getElementById('faqCount');
    var emptyEl = document.getElementById('faqEmpty');
    if (!listEl || !catsEl) { return; }

    var activeCat = 'upsc';
    var query = '';

    /* ---- render category buttons with counts ---- */
    var catsHTML = CATEGORIES.map(function (c) {
      var count = FAQS.filter(function (f) { return f.cat === c.id; }).length;
      return '<button type="button" class="faq-cat' + (c.id === activeCat ? ' is-active' : '') +
        '" data-cat="' + c.id + '" aria-pressed="' + (c.id === activeCat) + '">' +
        c.label + '<span class="faq-cat__count">' + count + '</span></button>';
    }).join('');
    catsEl.innerHTML = catsHTML;

    /* ---- render items ---- */
    function itemHTML(f, i) {
      return '<div class="faq-item" data-cat="' + f.cat + '" data-faq="' + i + '" ' +
        'data-search="' + esc((f.q + ' ' + f.a + ' ' + catLabel(f.cat)).replace(/<[^>]+>/g, '').toLowerCase()) + '">' +
        '<h3>' +
          '<button type="button" class="faq-item__q" aria-expanded="false" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '">' +
            '<span>' + f.q + '</span>' +
            '<span class="faq-item__icon" aria-hidden="true">' + icon('plus') + '</span>' +
          '</button>' +
        '</h3>' +
        '<div class="faq-item__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '">' +
          '<div><span class="faq-item__cat-tag">' + catLabel(f.cat) + '</span><p>' + f.a + '</p></div>' +
        '</div>' +
      '</div>';
    }
    listEl.innerHTML = FAQS.map(itemHTML).join('');

    /* ---- accordion: one open at a time, smooth height ---- */
    listEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-item__q');
      if (!btn) { return; }
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');

      /* close any open item */
      listEl.querySelectorAll('.faq-item.is-open').forEach(function (open) {
        open.classList.remove('is-open');
        var b = open.querySelector('.faq-item__q');
        if (b) { b.setAttribute('aria-expanded', 'false'); }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    /* ---- filtering ---- */
    function apply() {
      var items = listEl.querySelectorAll('.faq-item');
      var visible = 0;
      items.forEach(function (item) {
        var matchCat = (activeCat === 'all') || (item.getAttribute('data-cat') === activeCat);
        var matchQuery = !query || (item.getAttribute('data-search') || '').indexOf(query) > -1;
        var show = matchCat && matchQuery;
        item.classList.toggle('is-hidden', !show);
        if (!show && item.classList.contains('is-open')) {
          item.classList.remove('is-open');
          var b = item.querySelector('.faq-item__q');
          if (b) { b.setAttribute('aria-expanded', 'false'); }
        }
        if (show) { visible++; }
      });
      if (countEl) {
        countEl.innerHTML = query
          ? 'Found <strong>' + visible + '</strong> answer' + (visible === 1 ? '' : 's') + ' for “<strong>' + esc(query) + '</strong>” across all categories'
          : 'Showing <strong>' + visible + '</strong> question' + (visible === 1 ? '' : 's') + ' in <strong>' + catLabel(activeCat) + '</strong>';
      }
      if (emptyEl) {
        emptyEl.classList.toggle('is-visible', visible === 0);
      }
      /* when searching, show category tags context — handled by tag already */
    }

    catsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-cat');
      if (!btn) { return; }
      catsEl.querySelectorAll('.faq-cat').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      activeCat = btn.getAttribute('data-cat');
      /* clear search when switching category */
      query = '';
      if (searchEl) { searchEl.value = ''; }
      if (clearEl) { clearEl.classList.remove('is-visible'); }
      apply();
    });

    if (searchEl) {
      searchEl.addEventListener('input', function () {
        query = searchEl.value.trim().toLowerCase();
        if (clearEl) { clearEl.classList.toggle('is-visible', query.length > 0); }
        if (query) {
          /* search spans all categories */
          catsEl.querySelectorAll('.faq-cat').forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          activeCat = 'all';
        } else {
          var fallback = catsEl.querySelector('.faq-cat[data-cat="' + (activeCat === 'all' ? 'upsc' : activeCat) + '"]');
          if (fallback) { fallback.click(); return; }
        }
        apply();
      });
    }
    if (clearEl) {
      clearEl.addEventListener('click', function () {
        if (searchEl) { searchEl.value = ''; searchEl.focus(); }
        query = '';
        clearEl.classList.remove('is-visible');
        var first = catsEl.querySelector('.faq-cat[data-cat="upsc"]');
        if (first) { first.click(); } else { activeCat = 'upsc'; apply(); }
      });
    }

    /* deep-link: faq.html?cat=hcs or faq.html#q=... */
    var params = new URLSearchParams(window.location.search);
    var catParam = (params.get('cat') || '').toLowerCase();
    if (catParam) {
      var target = catsEl.querySelector('.faq-cat[data-cat="' + catParam + '"]');
      if (target) { target.click(); }
    }

    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
