/* =============================================================
   GOODMAN ATOMIC APPLIANCE SERVICE — main.js
   Retro-futurist atomic-era appliance repair
   ============================================================= */

(function () {
  'use strict';

  /* ─── GLOBALS ─────────────────────────────────────────────── */
  var PHONE = '(240) 744-0515';
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ─── ZIP CODE SERVICE AREA ───────────────────────────────── */
  /* DC prefixes 200–205; MD prefixes 206–209 are caught by range check.
     Additional specific codes for Howard, Frederick, Arlington, Fairfax. */
  var ZIP_SPECIFIC = new Set([
    // Howard County, MD
    '20701','20723','20759','20763','20777','20794',
    '21029','21036','21042','21043','21044','21045','21046','21075',
    '21104','21163','21723','21737','21738','21794','21797',
    // Frederick County, MD
    '21701','21702','21703','21704','21710','21716','21727',
    '21754','21755','21758','21769','21770','21771','21773',
    '21774','21777','21778','21780','21788','21793','21798',
    // Arlington County, VA (22201–22209, 22213)
    '22201','22202','22203','22204','22205','22206','22207',
    '22208','22209','22213',
    // Fairfax County (east), VA
    '22003','22027','22030','22031','22032','22033','22041',
    '22042','22043','22044','22046','22066','22101','22102',
    '22124','22180','22181','22182'
  ]);

  function isInServiceArea(zip) {
    if (!/^\d{5}$/.test(zip)) return null; // invalid
    var prefix = parseInt(zip.slice(0, 3), 10);
    // DC: 200–205; MD general: 206–209
    if (prefix >= 200 && prefix <= 209) return true;
    return ZIP_SPECIFIC.has(zip);
  }

  /* ─── 1. SCROLL-RISE ANIMATIONS ──────────────────────────── */
  (function initRise() {
    var items = document.querySelectorAll('[data-rise]');
    if (!items.length) return;

    if (rm) {
      items.forEach(function (el) {
        el.classList.add('risen');
        el.style.opacity = '1';
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('risen'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var delay = e.target.dataset.riseDelay || '0';
          e.target.style.animationDelay = delay + 'ms';
          e.target.classList.add('risen');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  })();


  /* ─── 2. HAMBURGER MENU ───────────────────────────────────── */
  (function initMenu() {
    var btn = document.getElementById('menuBtn');
    var nav = document.querySelector('nav.main');
    if (!btn || !nav) return;

    function openMenu() {
      nav.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var isOpen = nav.classList.contains('open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); }
    });

    document.addEventListener('click', function (e) {
      var header = document.querySelector('header.site');
      if (header && !header.contains(e.target)) {
        closeMenu();
      }
    });
  })();


  /* ─── 3. DROPDOWN MENUS ───────────────────────────────────── */
  (function initDropdowns() {
    var items = document.querySelectorAll('.has-drop');
    if (!items.length) return;

    function closeAll(except) {
      items.forEach(function (item) {
        if (item === except) return;
        var menu = item.querySelector('.drop-menu');
        var toggle = item.querySelector('.drop-toggle');
        if (menu) menu.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }

    items.forEach(function (item) {
      var toggle = item.querySelector('.drop-toggle');
      var menu   = item.querySelector('.drop-menu');
      if (!toggle || !menu) return;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = menu.classList.contains('open');
        closeAll(item);
        if (isOpen) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (e) {
      var inDrop = false;
      items.forEach(function (item) {
        if (item.contains(e.target)) { inDrop = true; }
      });
      if (!inDrop) { closeAll(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeAll(); }
    });
  })();


  /* ─── 4. DISPATCH PANEL TYPEWRITER ───────────────────────── */
  (function initDispatchPanel() {
    var crt = document.getElementById('dpCrt');
    if (!crt) return;

    var LINES = [
      'DIAGNOSTICS ...... OK',
      'TECHNICIAN: AVAILABLE',
      'BOOK A REPAIR'
    ];

    function typeChar(text, el, i, done) {
      if (i >= text.length) {
        if (done) done();
        return;
      }
      el.textContent += text[i];
      setTimeout(function () { typeChar(text, el, i + 1, done); }, 28);
    }

    function typeLine(lineIndex) {
      if (lineIndex >= LINES.length) {
        var cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.setAttribute('aria-hidden', 'true');
        crt.appendChild(cursor);
        return;
      }

      var div = document.createElement('div');
      div.className = 'tl';
      crt.appendChild(div);

      typeChar(LINES[lineIndex], div, 0, function () {
        setTimeout(function () { typeLine(lineIndex + 1); }, 110);
      });
    }

    if (rm) {
      LINES.forEach(function (text) {
        var div = document.createElement('div');
        div.className = 'tl';
        div.textContent = text;
        crt.appendChild(div);
      });
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      crt.appendChild(cursor);
      return;
    }

    setTimeout(function () { typeLine(0); }, 1400);
  })();


  /* ─── 5. REQUEST FORM HANDLING ────────────────────────────── */
  (function initReqForm() {
    var form = document.getElementById('reqForm');
    var note = document.getElementById('formNote');
    if (!form || !note) return;

    function showNote(msg, isError) {
      note.textContent = msg;
      note.className = isError ? 'error' : '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl  = form.querySelector('[name="name"]');
      var phoneEl = form.querySelector('[name="phone"]');

      if (!nameEl || !phoneEl) return;

      var name  = nameEl.value.trim();
      var phone = phoneEl.value.replace(/\D/g, '');

      if (!name) {
        showNote('Please enter your name.', true);
        nameEl.focus();
        return;
      }

      if (phone.length !== 10) {
        showNote('Please enter a valid 10-digit phone number.', true);
        phoneEl.focus();
        return;
      }

      showNote('Got it, ' + name + '! We\'ll contact you at ' +
        phoneEl.value.trim() + ' to confirm your appointment.', false);

      form.reset();
    });
  })();


  /* ─── 6. CHAT TERMINAL ────────────────────────────────────── */
  (function initChat() {
    var chatEl    = document.getElementById('chat');
    var logEl     = document.getElementById('chatLog');
    var inputEl   = document.getElementById('chatInput');
    var sendBtn   = document.getElementById('chatSend');
    var closeBtn  = document.getElementById('chatClose');
    if (!chatEl || !logEl || !inputEl) return;

    var step      = 0;
    var data      = {};
    var booted    = false;
    var typing    = false;
    var lastOpener = null;

    var BOOT = [
      'GOODMAN ATOMIC DISPATCH v2.6',
      'FIELD ROUTER: INITIALIZING\u2026',
      'SCHEDULER: ONLINE',
      'SYSTEM READY.',
      ''
    ];

    var APPL = [
      'Refrigerator',
      'Washer',
      'Dryer',
      'Dishwasher',
      'Oven / Range',
      'Microwave',
      'Freezer',
      'Other'
    ];

    var SLOTS = [
      'Morning (8am–12pm)',
      'Afternoon (12pm–5pm)',
      'Evening (5pm–8pm)'
    ];

    /* Create a message element */
    function el(cls) {
      var d = document.createElement('div');
      d.className = 'msg ' + cls;
      return d;
    }

    /* Instant message */
    function line(text, cls) {
      var m = el(cls || 'bot');
      m.textContent = text;
      logEl.appendChild(m);
      logEl.scrollTop = logEl.scrollHeight;
      return m;
    }

    /* Typewriter message */
    function type(text, cls, done) {
      typing = true;
      var m = el(cls || 'bot');
      m.textContent = '';
      logEl.appendChild(m);
      logEl.scrollTop = logEl.scrollHeight;

      if (rm) {
        m.textContent = text;
        typing = false;
        if (done) done();
        return;
      }

      var i = 0;
      var iv = setInterval(function () {
        if (i >= text.length) {
          clearInterval(iv);
          typing = false;
          logEl.scrollTop = logEl.scrollHeight;
          if (done) done();
          return;
        }
        m.textContent += text[i];
        i++;
        logEl.scrollTop = logEl.scrollHeight;
      }, 20);
    }

    /* Render option buttons */
    function opts(list) {
      var row = document.createElement('div');
      row.className = 'chat-opts';
      list.forEach(function (item) {
        var b = document.createElement('button');
        b.className = 'chat-opt';
        b.textContent = item;
        b.addEventListener('click', function () {
          row.remove();
          answer(item);
        });
        row.appendChild(b);
      });
      logEl.appendChild(row);
      logEl.scrollTop = logEl.scrollHeight;
    }

    /* Ask current step */
    function ask() {
      switch (step) {
        case 0:
          type('What appliance needs service?', 'bot', function () { opts(APPL); });
          break;
        case 1:
          type('What\'s happening with it? (brief description)', 'bot');
          break;
        case 2:
          type('Your ZIP code?', 'bot');
          break;
        case 3:
          type('Your name?', 'bot');
          break;
        case 4:
          type('Your phone number?', 'bot');
          break;
        case 5:
          type('Preferred time?', 'bot', function () { opts(SLOTS); });
          break;
        case 6:
          var summary =
            'BOOKING SUMMARY\n' +
            '  Appliance : ' + data.appliance + '\n' +
            '  Issue     : ' + data.issue + '\n' +
            '  ZIP       : ' + data.zip + '\n' +
            '  Name      : ' + data.name + '\n' +
            '  Phone     : ' + data.phone + '\n' +
            '  Time      : ' + data.slot;
          line(summary, 'bot');
          type('Confirm? Type YES to submit or NO to restart.', 'bot');
          break;
        default:
          break;
      }
    }

    /* Process user answer */
    function answer(t) {
      var val = t.trim();
      line(val, 'me');

      switch (step) {
        case 0:
          data.appliance = val;
          step = 1;
          ask();
          break;
        case 1:
          data.issue = val;
          step = 2;
          ask();
          break;
        case 2:
          if (!/^\d{5}$/.test(val)) {
            line('Please enter a valid 5-digit ZIP code.', 'warn');
            return;
          }
          data.zip = val;
          step = 3;
          ask();
          break;
        case 3:
          if (val.length < 2) {
            line('Please enter your name.', 'warn');
            return;
          }
          data.name = val;
          step = 4;
          ask();
          break;
        case 4:
          var digits = val.replace(/\D/g, '');
          if (digits.length !== 10) {
            line('Please enter a valid 10-digit phone number.', 'warn');
            return;
          }
          data.phone = val;
          step = 5;
          ask();
          break;
        case 5:
          data.slot = val;
          step = 6;
          ask();
          break;
        case 6:
          if (val.toUpperCase() === 'YES') {
            type('Request submitted! We\'ll call ' + data.name +
              ' at ' + data.phone + ' to confirm. — GOODMAN ATOMIC', 'bot');
            step = 99;
          } else if (val.toUpperCase() === 'NO') {
            step = 0;
            data = {};
            type('No problem. Let\'s start over.', 'bot', ask);
          } else {
            line('Type YES to confirm or NO to restart.', 'warn');
          }
          break;
        default:
          break;
      }
    }

    /* Boot sequence */
    function runBoot(done) {
      var i = 0;
      function next() {
        if (i >= BOOT.length) {
          if (done) done();
          return;
        }
        var txt = BOOT[i];
        i++;
        if (txt === '') {
          setTimeout(next, 200);
          return;
        }
        line(txt, 'bot');
        setTimeout(next, rm ? 0 : 200);
      }
      next();
    }

    /* Handle send */
    function handleSend() {
      if (typing) return;
      var val = inputEl.value.trim();
      if (!val) return;
      inputEl.value = '';
      answer(val);
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', handleSend);
    }

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
    });

    /* Open chat */
    function openChat(from) {
      lastOpener = from || null;
      chatEl.classList.add('open');
      chatEl.removeAttribute('hidden');
      chatEl.setAttribute('aria-hidden', 'false');
      inputEl.focus();

      if (!booted) {
        booted = true;
        runBoot(function () {
          ask();
        });
      }
    }

    /* Close chat */
    function closeChat() {
      chatEl.classList.remove('open');
      chatEl.setAttribute('aria-hidden', 'true');
      if (lastOpener && lastOpener.focus) { lastOpener.focus(); }
      lastOpener = null;
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeChat);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && chatEl.classList.contains('open')) {
        closeChat();
      }
    });

    /* Attach to all [data-open-chat] triggers */
    document.querySelectorAll('[data-open-chat]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openChat(trigger);
      });
    });

    /* FAB */
    var fab = document.querySelector('.fab');
    if (fab) {
      fab.addEventListener('click', function () { openChat(fab); });
    }

    /* Expose for external use */
    window.openAtomicChat  = openChat;
    window.closeAtomicChat = closeChat;
  })();


  /* ─── 7. CHAT KEYBOARD ON MOBILE ─────────────────────────── */
  if ('visualViewport' in window) {
    visualViewport.addEventListener('resize', function () {
      var chatEl = document.getElementById('chat');
      if (chatEl && chatEl.classList.contains('open')) {
        chatEl.style.height = visualViewport.height + 'px';
        chatEl.style.top    = (visualViewport.offsetTop || 0) + 'px';
      }
    });
  }


  /* ─── 8. ZIP CHECKER ──────────────────────────────────────── */
  (function initZipChecker() {
    var input  = document.getElementById('zipInput');
    var btn    = document.getElementById('zipBtn');
    var result = document.getElementById('zipResult');
    if (!input || !btn || !result) return;

    function check() {
      var zip = input.value.trim();
      if (!/^\d{5}$/.test(zip)) {
        result.textContent = 'Enter a 5-digit ZIP code.';
        result.innerHTML = 'Enter a 5-digit ZIP code.';
        return;
      }
      var inZone = isInServiceArea(zip);
      if (inZone) {
        result.innerHTML =
          'Good news, we service your area.' +
          '<br><button class="btn btn-cream zip-book-btn" type="button" data-open-chat data-zip="' + zip + '">Book a repair</button>';
        // Reattach chat opener for newly created button
        var bookBtn = result.querySelector('[data-open-chat]');
        if (bookBtn && window.openAtomicChat) {
          bookBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.openAtomicChat(bookBtn, zip);
          });
        }
      } else {
        result.textContent = 'We may still be able to help. Call (240) 744-0515 to confirm.';
      }
    }

    btn.addEventListener('click', check);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });
  })();


  /* ─── 9. MD DETAILS: CLOSE ON MOBILE ─────────────────────── */
  (function initMdDetails() {
    var md = document.getElementById('mdDetails');
    if (!md) return;
    // On mobile (<= 980px), close by default
    function applyDefault() {
      if (window.innerWidth <= 980) {
        md.removeAttribute('open');
      } else {
        md.setAttribute('open', '');
      }
    }
    applyDefault();
    window.addEventListener('resize', applyDefault);
  })();


  /* ─── 10. DISPATCH PANEL KEYBOARD ────────────────────────── */
  (function initDispatchKeyboard() {
    var panel = document.querySelector('.dispatch-panel');
    if (!panel) return;
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (window.openAtomicChat) { window.openAtomicChat(panel); }
      }
    });
  })();

})();
