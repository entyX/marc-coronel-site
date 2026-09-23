/* ═══════════════════════════════════════════════════════════════════════
   Marc Coronel — interaction layer
   GSAP + ScrollTrigger + SplitText for choreography, Lenis for smooth
   scrolling. Everything animates transform / opacity / clip-path / mask.
   If the libraries fail to load, or the visitor prefers reduced motion,
   the page falls back to a complete, static, fully readable document.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  var root   = document.documentElement;
  var body   = document.body;
  var calm   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var params = new URLSearchParams(location.search);

  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var motion  = hasGsap && !calm;
  if (!motion) root.classList.add('no-motion');
  if (!fine) root.classList.add('is-touch');

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* numbered rounds: R1…R8 outline numerals */
  $$('.round').forEach(function (r, i) { r.setAttribute('data-n', ('0' + (i + 1)).slice(-2)); });

  /* ── shared: scrolling ───────────────────────────────────────────── */
  var lenis = null;
  function scrollToTarget(target, opts) {
    opts = opts || {};
    if (lenis) lenis.scrollTo(target, { offset: opts.offset || 0, duration: opts.duration || 1.6, immediate: !!opts.immediate });
    else {
      var y = typeof target === 'number' ? target : (target.getBoundingClientRect().top + scrollY + (opts.offset || 0));
      scrollTo({ top: y, behavior: calm || opts.immediate ? 'auto' : 'smooth' });
    }
  }

  // every in-page link goes through the same smooth path
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    if (root.classList.contains('is-menu')) closeMenu();
    scrollToTarget(id === '#top' ? 0 : t);
    if (a.dataset.intent) setIntent(a.dataset.intent);
  });

  /* ── index menu ──────────────────────────────────────────────────── */
  var menuBtn = $('#menuBtn'), menu = $('#menu'), preview = $('#menuPreview');
  function openMenu() {
    root.classList.add('is-menu');
    menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('.head__menu-txt').textContent = 'Close';
    if (lenis) lenis.stop();
  }
  function closeMenu() {
    root.classList.remove('is-menu');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    $('.head__menu-txt').textContent = 'Index';
    if (lenis) lenis.start();
  }
  menuBtn.addEventListener('click', function () { root.classList.contains('is-menu') ? closeMenu() : openMenu(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('is-menu')) closeMenu(); });
  $$('.menu__list a').forEach(function (a) {
    a.addEventListener('mouseenter', function () {
      if (!preview || preview.getAttribute('src') === a.dataset.img) return;
      preview.style.opacity = 0;
      setTimeout(function () { preview.src = a.dataset.img; preview.style.opacity = 1; }, 180);
    });
  });

  /* ── booking form ────────────────────────────────────────────────── */
  function setIntent(v) {
    var r = $('.form__intent input[value="' + v + '"]');
    if (r) r.checked = true;
    setTimeout(function () { var m = $('#f-name'); if (m) m.focus({ preventScroll: true }); }, 1700);
  }
  var form = $('#bookForm'), status = $('#formStatus');
  form.addEventListener('submit', function (e) {
    var req = $$('[required]', form);
    req.forEach(function (f) { f.classList.remove('is-bad'); });
    var bad = req.filter(function (f) { return !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)); });
    if (bad.length) {
      e.preventDefault();
      bad.forEach(function (f) { f.classList.add('is-bad'); });
      status.textContent = 'Needs a name, a valid email and a short note.';
      bad[0].focus();
      return;
    }
    var action = form.getAttribute('action');
    if (!action || action === '#') {
      // no endpoint yet: hand off to the visitor's mail client (README)
      e.preventDefault();
      var d = new FormData(form), lines = [];
      d.forEach(function (v, k) { if (v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + v); });
      var to = ($('.contact__direct a[href^="mailto:"]') || {}).href || 'mailto:hello@marccoronel.com';
      location.href = to + '?subject=' + encodeURIComponent('Booking request: ' + (d.get('intent') || 'Enquiry')) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      status.textContent = 'Opening your email client…';
    } else {
      status.textContent = 'Sending…';
    }
  });

  /* ── sound: a soft generated pad, off by default, never autoplays ── */
  (function sound() {
    var btn = $('#soundBtn'); if (!btn) return;
    var ctx = null, master = null, on = false, timer = null, step = 0;
    // Cmaj9 → Am9 → Fmaj7#11 → G6/9 — warm, unhurried, jazz-voiced
    var CHORDS = [
      [130.81, 164.81, 196.00, 246.94, 293.66],
      [110.00, 130.81, 164.81, 196.00, 246.94],
      [87.31, 110.00, 130.81, 164.81, 246.94],
      [98.00, 123.47, 146.83, 164.81, 220.00]
    ];
    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = .4;
      var delay = ctx.createDelay(); delay.delayTime.value = .42;
      var fb = ctx.createGain(); fb.gain.value = .32;
      delay.connect(fb); fb.connect(delay);
      lp.connect(master); lp.connect(delay); delay.connect(master);
      master.connect(ctx.destination);
      var lfo = ctx.createOscillator(), lfoG = ctx.createGain();
      lfo.frequency.value = .07; lfoG.gain.value = 320; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start();
      ctx._in = lp;
    }
    function chord() {
      var t = ctx.currentTime, notes = CHORDS[step++ % CHORDS.length];
      notes.forEach(function (f, i) {
        [-4, 4].forEach(function (det) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = i === 0 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = det;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(.05 / notes.length * (i === 0 ? 1.6 : 1), t + 2.6);
          g.gain.linearRampToValueAtTime(0, t + 9.5);
          o.connect(g); g.connect(ctx._in); o.start(t); o.stop(t + 10);
        });
      });
    }
    btn.addEventListener('click', function () {
      on = !on;
      btn.setAttribute('aria-pressed', on);
      $('em', btn).textContent = on ? 'on' : 'off';
      root.classList.toggle('is-sound', on);
      if (on) {
        if (!ctx) build();
        ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(.9, ctx.currentTime + 2);
        chord(); timer = setInterval(chord, 7000);
      } else if (ctx) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        clearInterval(timer);
      }
    });
  }());

  /* ── quotes (works with or without GSAP) ─────────────────────────── */
  var quotes = $$('.quote'), qi = 0, qTimer = null;
  $('#qAll').textContent = ('0' + quotes.length).slice(-2);

  /* ── writing shelf: drag to scroll with a little inertia ─────────── */
  (function shelf() {
    var el = $('#shelf'), bar = $('#shelfBar'); if (!el) return;
    var down = false, sx = 0, sl = 0, v = 0, lx = 0, moved = 0, raf;
    function paint() { var max = el.scrollWidth - el.clientWidth; bar.style.transform = 'scaleX(' + (max > 0 ? clamp(.1 + .9 * el.scrollLeft / max, .1, 1) : 1) + ')'; }
    el.addEventListener('scroll', paint, { passive: true });
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = lx = e.clientX; sl = el.scrollLeft; v = 0; cancelAnimationFrame(raf);
    });
    addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) el.classList.add('is-drag');
      v = e.clientX - lx; lx = e.clientX;
      el.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', function () {
      if (!down) return; down = false;
      setTimeout(function () { el.classList.remove('is-drag'); }, 0);
      (function glide() { if (Math.abs(v) < .4) return; el.scrollLeft -= v; v *= .93; raf = requestAnimationFrame(glide); })();
    });
    el.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    paint();
  }());

  /* ─────────────────────────────────────────────────────────────────── */
  if (!motion) {
    // static fallback: simple quote stepping, all content visible
    function showQ(n) { quotes[qi].classList.remove('is-on'); qi = (n + quotes.length) % quotes.length; quotes[qi].classList.add('is-on'); $('#qNow').textContent = ('0' + (qi + 1)).slice(-2); }
    $('#qNext').addEventListener('click', function () { showQ(qi + 1); });
    $('#qPrev').addEventListener('click', function () { showQ(qi - 1); });
    $$('.round').forEach(function (r) { r.classList.add('is-active'); });
    body.classList.add('is-loaded');
    return;
  }

  /* ═══════════════════════════════════════════════════════════════════
     MOTION
     ═══════════════════════════════════════════════════════════════════ */
  function startMotion() {
  root.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  var hasSplit = !!window.SplitText;
  var mm = gsap.matchMedia();
  var DESK = '(min-width: 901px)';

  /* ── Lenis ───────────────────────────────────────────────────────── */
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    // pins add scroll distance after Lenis measured the page; keep its limit honest
    ScrollTrigger.addEventListener('refresh', function () { lenis.resize(); });
  }

  /* ── cursor ──────────────────────────────────────────────────────── */
  var cursor = $('#cursor'), cLabel = $('#cursorLabel'), cLabelTxt = $('span', cLabel);
  var mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  if (fine) {
    root.classList.add('has-cursor');
    var cx = gsap.quickTo(cursor, 'x', { duration: .18, ease: 'power3' }),
        cy = gsap.quickTo(cursor, 'y', { duration: .18, ease: 'power3' }),
        lx = gsap.quickTo(cLabel, 'x', { duration: .45, ease: 'power3' }),
        ly = gsap.quickTo(cLabel, 'y', { duration: .45, ease: 'power3' });
    addEventListener('pointermove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
      cx(e.clientX); cy(e.clientY); lx(e.clientX); ly(e.clientY);
      cursor.classList.add('is-on');
    }, { passive: true });
    root.addEventListener('mouseleave', function () { cursor.classList.remove('is-on'); cLabel.classList.remove('is-on'); });
    addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
    addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label');
      cursor.classList.remove('is-active', 'is-hold');
      cLabel.classList.remove('is-on');
      if (!t) return;
      var key = t.getAttribute('data-cursor');
      if (!key && t.tagName === 'A' && t.target === '_blank') key = 'Open';
      if (key === 'Hold') { cursor.classList.add('is-hold'); return; }
      if (key) { cLabelTxt.textContent = key; cLabel.classList.add('is-on'); cursor.classList.add('is-active'); }
      else cursor.classList.add('is-active');
    }, { passive: true });
  }

  /* ── split helpers ───────────────────────────────────────────────── */
  function splitLines(el) {
    if (!hasSplit) return [el];
    var s = new SplitText(el, { type: 'lines', linesClass: 'split-line-in', mask: 'lines' });
    return s.lines;
  }

  /* ── loader → hero entrance ──────────────────────────────────────── */
  var loader = $('#loader');
  var heroStage = $('#heroStage');
  var heroWords = $$('[data-hero-word]');
  var heroChars = [];
  if (hasSplit) heroWords.forEach(function (w) { heroChars = heroChars.concat(new SplitText(w, { type: 'chars', charsClass: 'char' }).chars); });
  gsap.set(heroWords, { yPercent: 0, clearProps: 'transform' });
  if (heroChars.length) gsap.set(heroChars, { yPercent: 110 }); else gsap.set(heroWords, { yPercent: 110 });

  var seen = false;
  try { seen = sessionStorage.getItem('mc-seen') === '1'; sessionStorage.setItem('mc-seen', '1'); } catch (e) {}
  var skipLoader = params.has('noloader');

  function heroIn(delay) {
    var tl = gsap.timeline({ delay: delay || 0, onComplete: function () { body.classList.add('is-loaded'); } });
    tl.fromTo('.hero__panels .hp', { scale: 1.18, yPercent: 6 }, { scale: 1, yPercent: 0, duration: 1.8, ease: 'expo.out', stagger: .07 }, 0)
      .to(heroChars.length ? heroChars : heroWords, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .035 }, .15)
      .to('.hero__kicker', { opacity: 1, duration: 1 }, .45)
      .to('[data-hero-fade]', { opacity: 1, duration: 1.1, stagger: .12 }, .7);
    if (!fine) tl.call(function () { $('#hero').classList.add('is-colored'); }, null, 1.6);
    return tl;
  }

  if (skipLoader || !loader) {
    if (loader) loader.remove();
    heroIn(0);
  } else {
    if (lenis) lenis.stop();
    var nameChars = hasSplit ? new SplitText('#loaderName', { type: 'chars', charsClass: 'char' }).chars : [$('#loaderName')];
    var roles = $$('#loaderRoles span');
    var count = { v: 0 }, countEl = $('#loaderCount');
    var ltl = gsap.timeline();
    var hold = seen ? .7 : 2;
    ltl.from(nameChars, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: .06 }, 0)
       .from('.loader__kicker', { opacity: 0, duration: .8 }, .2)
       .to(count, { v: 100, duration: hold + .5, ease: 'power2.inOut', onUpdate: function () { var v = Math.round(count.v); countEl.textContent = v < 10 ? '0' + v : v; } }, 0);
    roles.forEach(function (r, i) {
      var at = .3 + i * (hold / roles.length);
      ltl.fromTo(r, { yPercent: 110 }, { yPercent: 0, duration: .45, ease: 'power3.out' }, at);
      if (i < roles.length - 1) ltl.to(r, { yPercent: -110, duration: .45, ease: 'power3.in' }, at + hold / roles.length - .12);
    });
    ltl.addLabel('out', hold + .6)
       .to(nameChars, { yPercent: -115, duration: .7, ease: 'power3.in', stagger: .03 }, 'out')
       .to(['.loader__kicker', '.loader__roles', '.loader__count', '.loader__skip'], { opacity: 0, duration: .4 }, 'out')
       .to('.loader__shutters span', { scaleY: 0, duration: 1.1, ease: 'expo.inOut', stagger: .08 }, 'out+=.35')
       .add(heroIn(0), 'out+=.55')
       .call(function () { if (lenis) lenis.start(); loader.remove(); }, null, 'out+=1.7');
    var skip = function () { if (ltl.time() < ltl.labels.out) ltl.seek('out'); };
    loader.addEventListener('click', skip);
    addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') skip(); }, { once: true });
  }

  /* ── hero: cursor paints colour back in; hold keeps it ───────────── */
  (function heroReveal() {
    var hero = $('#hero'), layer = $('#heroColor');
    if (!fine) return;
    var st = { x: -999, y: -999, r: 0, tx: -999, ty: -999, tr: 0 }, inside = false, held = false, seenPtr = false;
    var base = function () { return Math.min(innerWidth, innerHeight) * .2; };
    var big = function () { return Math.max(innerWidth, innerHeight) * .9; };
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      st.tx = e.clientX - r.left; st.ty = e.clientY - r.top;
      if (!seenPtr) { seenPtr = true; st.x = st.tx; st.y = st.ty; }
      inside = true;
      if (!held) st.tr = base();
    });
    hero.addEventListener('pointerleave', function () { inside = false; if (!held) st.tr = 0; });
    hero.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      held = true; st.tr = big();
    });
    addEventListener('pointerup', function () { if (!held) return; held = false; st.tr = inside ? base() : 0; });
    $$('.hp', layer).forEach(function (p, i) {
      p.addEventListener('pointerenter', function () { heroStage.setAttribute('data-active', i); });
    });
    hero.addEventListener('pointerleave', function () { heroStage.removeAttribute('data-active'); });
    gsap.ticker.add(function () {
      var dx = st.tx - st.x, dy = st.ty - st.y, dr = st.tr - st.r;
      if (Math.abs(dx) < .3 && Math.abs(dy) < .3 && Math.abs(dr) < .3) return;
      st.x += dx * .16; st.y += dy * .16; st.r += dr * (held ? .06 : .1);
      layer.style.setProperty('--mx', st.x.toFixed(1) + 'px');
      layer.style.setProperty('--my', st.y.toFixed(1) + 'px');
      layer.style.setProperty('--r', st.r.toFixed(1) + 'px');
    });
  }());

  // hero leaves at different speeds per panel, like a curtain lifting unevenly
  gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__panels .hp:nth-child(1) img', { yPercent: 10, ease: 'none' }, 0)
    .to('.hero__panels .hp:nth-child(2) img', { yPercent: 18, ease: 'none' }, 0)
    .to('.hero__panels .hp:nth-child(3) img', { yPercent: 7, ease: 'none' }, 0)
    .to('.hero__panels .hp:nth-child(4) img', { yPercent: 14, ease: 'none' }, 0)
    .to('.hero__content', { yPercent: -18, opacity: 0, ease: 'none' }, 0)
    .to('.hero__stage', { scale: .94, borderRadius: 24, ease: 'none' }, 0);

  /* ── rounded "rise" on sections that change colour ───────────────── */
  $$('.pause, .impact, .room, .platform, .lanes, .contact').forEach(function (s) {
    gsap.fromTo(s, { '--r': '9vw' }, { '--r': '0vw', ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 20%', scrub: true } });
  });

  /* ── generic reveals ─────────────────────────────────────────────── */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .09, overwrite: true }); }
  });
  $$('[data-split="lines"]').forEach(function (el) {
    var lines = splitLines(el);
    gsap.from(lines, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: .09, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('[data-split="words"]').forEach(function (el) {
    if (!hasSplit) return;
    var w = new SplitText(el, { type: 'words' }).words;
    gsap.fromTo(w, { opacity: .12 }, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: true } });
  });

  /* ── manifesto: words light up as you read; image pills bloom ────── */
  (function manifesto() {
    var el = $('#manifesto'); if (!el) return;
    var items = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span'); s.className = 'word'; s.textContent = part; frag.appendChild(s); items.push(s);
        });
        el.replaceChild(frag, n);
      } else if (n.classList && n.classList.contains('pill')) items.push(n);
    });
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: .6 } });
    items.forEach(function (it, i) {
      if (it.classList.contains('pill')) tl.fromTo(it, { width: 0, opacity: 0 }, { width: '1.9em', opacity: 1, duration: 3, ease: 'power2.out' }, i);
      else tl.fromTo(it, { opacity: .13 }, { opacity: 1, duration: 1.2, ease: 'none' }, i);
    });
  }());

  gsap.fromTo('.intro__portrait img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.intro__portrait', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.intro__portrait', { clipPath: 'inset(100% 0 0 0 round 16px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.intro__portrait', start: 'top 85%' } });

  /* ── hover-follow images (roles + honors) ────────────────────────── */
  function followList(listSel, itemSel, floatSel) {
    var list = $(listSel), fl = $(floatSel); if (!list || !fl || !fine) return;
    var img = $('img', fl), sec = list.parentElement;
    var fx = gsap.quickTo(fl, 'x', { duration: .6, ease: 'power3' }), fy = gsap.quickTo(fl, 'y', { duration: .6, ease: 'power3' });
    var lastX = 0, rot = gsap.quickTo(fl, 'rotation', { duration: .8, ease: 'power3' });
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      fx(e.clientX - r.left - fl.offsetWidth / 2 + 40);
      fy(e.clientY - r.top - fl.offsetHeight / 2);
      rot(clamp((e.clientX - lastX) * .6, -10, 10)); lastX = e.clientX;
    });
    $$(itemSel, list).forEach(function (it) {
      it.addEventListener('pointerenter', function () {
        if (img.getAttribute('src') !== it.dataset.img) img.src = it.dataset.img;
        gsap.to(fl, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' });
      });
    });
    list.addEventListener('pointerleave', function () { gsap.to(fl, { opacity: 0, scale: .6, duration: .4, ease: 'power3.in' }); });
  }
  followList('#rolesList', '.role', '#rolesFloat');
  followList('#honorsList', '.honor', '#honorsFloat');

  gsap.from('.role', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '#rolesList', start: 'top 82%' } });
  gsap.from('.honor', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: '#honorsList', start: 'top 85%' } });

  /* ── the pause: 1 in 7 lands like a punch ────────────────────────── */
  gsap.from('.pause__stat > *', { yPercent: 60, opacity: 0, scale: .8, duration: 1.4, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.pause__stat', start: 'top 80%' } });

  /* ── counters ────────────────────────────────────────────────────── */
  $$('.metric__n b[data-count]').forEach(function (b) {
    var end = +b.dataset.count, o = { v: 0 };
    b.textContent = '0';
    ScrollTrigger.create({ trigger: b, start: 'top 88%', once: true, onEnter: function () {
      gsap.to(o, { v: end, duration: end > 100 ? 2.2 : 1.6, ease: 'expo.out', onUpdate: function () { b.textContent = Math.round(o.v); } });
    } });
  });

  /* ── EIGHT ROUNDS: vertical scroll drives a horizontal track ─────── */
  var rounds = $('#rounds'), track = $('#roundsTrack'), cards = $$('.round'), idx = $$('#roundsIndex li'), bar = $('#roundsBar');
  var roundsST = null, activeRound = -1;
  function setRound(i) {
    if (i === activeRound) return;
    activeRound = i;
    cards.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
    idx.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
    var tone = cards[i].dataset.tone;
    gsap.to(rounds, { backgroundColor: tone, duration: .9, ease: 'power2.out', overwrite: 'auto' });
    rounds.classList.toggle('is-dark', cards[i].classList.contains('round--dark'));
    if (roundsST && roundsST.isActive) root.dataset.head = rounds.classList.contains('is-dark') ? 'dark' : 'light';
    var ib = idx[i] && $('button', idx[i]), ix = $('#roundsIndex');
    if (ib && ix.scrollWidth > ix.clientWidth) ix.scrollLeft = ib.offsetLeft - (ix.clientWidth - ib.offsetWidth) / 2;
  }

  mm.add(DESK, function () {
    var dist = function () { return track.scrollWidth - innerWidth; };
    var tween = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: {
        trigger: rounds, pin: '#roundsPin', start: 'top top',
        end: function () { return '+=' + dist(); },
        scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) {
          bar.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
          var x = -dist() * self.progress, focus = innerWidth * .42 - x, best = 0, bd = Infinity;
          cards.forEach(function (c, k) { var d = Math.abs(c.offsetLeft + c.offsetWidth * .3 - focus); if (d < bd) { bd = d; best = k; } });
          setRound(best);
        }
      }
    });
    roundsST = tween.scrollTrigger;
    cards.forEach(function (c) {
      var img = $('.round__media img', c);
      gsap.fromTo(img, { xPercent: -14 }, { xPercent: 0, ease: 'none', scrollTrigger: { containerAnimation: tween, trigger: c, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo($('.round__media', c), { clipPath: 'inset(8% 40% 8% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', ease: 'power2.out', scrollTrigger: { containerAnimation: tween, trigger: c, start: 'left 95%', end: 'left 45%', scrub: true } });
    });
    setRound(0);
    return function () { roundsST = null; gsap.set(track, { clearProps: 'transform' }); };
  });
  mm.add('(max-width: 900px)', function () {
    cards.forEach(function (c) {
      c.classList.add('is-active');
      gsap.from(c, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%' } });
    });
  });
  $$('#roundsIndex button').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.dataset.goto;
      if (!roundsST) { scrollToTarget(cards[i], { offset: -80 }); return; }
      var d = track.scrollWidth - innerWidth;
      var want = clamp((cards[i].offsetLeft + cards[i].offsetWidth * .3 - innerWidth * .42) / d, 0, 1);
      scrollToTarget(roundsST.start + want * (roundsST.end - roundsST.start), { duration: 1.4 });
    });
  });
  addEventListener('keydown', function (e) {
    if (!roundsST || !roundsST.isActive) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      var n = clamp(activeRound + (e.key === 'ArrowRight' ? 1 : -1), 0, cards.length - 1);
      $$('#roundsIndex button')[n].click();
    }
  });

  /* ── the hinge: a small frame opens into the whole screen ────────── */
  gsap.timeline({ scrollTrigger: { trigger: '#hingePin', pin: true, start: 'top top', end: '+=160%', scrub: 1 } })
    .to('#hingeFrame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
    .to('#hingeFrame img', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
    .to('#hingeFrame', { '--dim': 1, duration: .6 }, .35)
    .from('#hingeL1', { yPercent: 60, opacity: 0, duration: .45 }, .45)
    .from('#hingeL2', { yPercent: 60, opacity: 0, duration: .45 }, .7)
    .to({}, { duration: .3 });

  /* ── IN THE ROOM: photos fly toward you as you scroll ────────────── */
  mm.add(DESK, function () {
    var flies = $$('.fly'), cap = $('#roomCap'), n = flies.length, lastCap = -1;
    flies.forEach(function (f) {
      var cs = getComputedStyle(f);
      f._x = parseFloat(cs.getPropertyValue('--x')); f._y = parseFloat(cs.getPropertyValue('--y'));
      gsap.set(f, { xPercent: -50, yPercent: -50, x: function () { return f._x * innerWidth / 100; }, y: function () { return f._y * innerHeight / 100; }, z: -2200, opacity: 0 });
    });
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#roomPin', pin: true, start: 'top top', end: '+=320%', scrub: 1, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var k = clamp(Math.floor(self.progress * n * 1.05), 0, n - 1);
          if (k !== lastCap) { lastCap = k; cap.textContent = $('figcaption', flies[k]).textContent; }
        }
      }
    });
    flies.forEach(function (f, i) {
      var at = i * .55;
      tl.to(f, { z: 650, ease: 'none', duration: 3 }, at)
        .to(f, { opacity: 1, ease: 'none', duration: .6 }, at)
        .to(f, { opacity: 0, ease: 'none', duration: .5 }, at + 2.5);
    });
    tl.fromTo('.room__title', { scale: 1.1 }, { scale: .86, ease: 'none', duration: tl.duration() }, 0);
    return function () { gsap.set(flies, { clearProps: 'all' }); };
  });

  /* ── quotes: masked line swap, auto-advancing ────────────────────── */
  (function quoteDeck() {
    var lines = quotes.map(function (q) { return splitLines($('blockquote', q)); });
    var caps = quotes.map(function (q) { return $('figcaption', q); });
    var timer = $('#qTimer'), busy = false, prog;
    quotes.forEach(function (q, i) { if (i) { gsap.set(lines[i], { yPercent: 110 }); gsap.set(caps[i], { opacity: 0 }); } });
    function go(n) {
      if (busy) return; busy = true;
      var from = qi; qi = (n + quotes.length) % quotes.length;
      $('#qNow').textContent = ('0' + (qi + 1)).slice(-2);
      quotes[qi].classList.add('is-on');
      gsap.timeline({ onComplete: function () { quotes[from].classList.remove('is-on'); busy = false; } })
        .to(lines[from], { yPercent: -110, duration: .7, ease: 'power3.in', stagger: .05 }, 0)
        .to(caps[from], { opacity: 0, duration: .4 }, 0)
        .fromTo(lines[qi], { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .07 }, .55)
        .to(caps[qi], { opacity: 1, duration: .6 }, .9);
      restart();
    }
    function restart() {
      if (prog) prog.kill();
      prog = gsap.fromTo(timer, { scaleX: 0 }, { scaleX: 1, duration: 7, ease: 'none', onComplete: function () { go(qi + 1); } });
      if (!inView) prog.pause();
    }
    var inView = false;
    ScrollTrigger.create({ trigger: '#quotes', start: 'top bottom', end: 'bottom top',
      onToggle: function (s) { inView = s.isActive; if (prog) s.isActive ? prog.play() : prog.pause(); } });
    $('#qNext').addEventListener('click', function () { go(qi + 1); });
    $('#qPrev').addEventListener('click', function () { go(qi - 1); });
    var q = $('#quotes'), sx = null;
    q.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    addEventListener('pointerup', function (e) { if (sx === null) return; var d = e.clientX - sx; sx = null; if (Math.abs(d) > 50) go(qi + (d < 0 ? 1 : -1)); });
    restart();
  }());

  /* ── writing cards cascade in ────────────────────────────────────── */
  gsap.from('.post', { x: 120, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: '#shelf', start: 'top 85%' } });

  /* ── platform: outline words drift against each other ────────────── */
  gsap.timeline({ scrollTrigger: { trigger: '.platform', start: 'top bottom', end: 'bottom top', scrub: true } })
    .fromTo('.platform__bg span:first-child', { xPercent: 6 }, { xPercent: -16, ease: 'none' }, 0)
    .fromTo('.platform__bg span:last-child', { xPercent: -14 }, { xPercent: 6, ease: 'none' }, 0);

  /* ── lanes: image wipes ──────────────────────────────────────────── */
  $$('.lane__img').forEach(function (f, i) {
    gsap.from(f, { clipPath: 'inset(100% 0 0 0)', duration: 1.5, ease: 'expo.inOut', delay: i * .1, scrollTrigger: { trigger: '#lanes', start: 'top 80%' } });
  });

  /* ── coda: a slow marquee that leans into your scroll speed ──────── */
  (function coda() {
    var tr = $('.coda__track'); if (!tr) return;
    var x = 0, half = 0, vis = false;
    function measure() { half = tr.scrollWidth / 2; }
    measure(); addEventListener('resize', measure);
    ScrollTrigger.create({ trigger: '.coda', start: 'top bottom', end: 'bottom top', onToggle: function (s) { vis = s.isActive; } });
    gsap.ticker.add(function () {
      if (!vis) return;
      var v = lenis ? Math.abs(lenis.velocity) : 0;
      x -= .7 + Math.min(v, 60) * .25;
      if (x <= -half) x += half;
      tr.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    });
  }());

  /* ── header colour follows whatever section sits under it ────────── */
  $$('[data-theme]').forEach(function (sec) {
    ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', onToggle: function (st) {
      if (!st.isActive) return;
      root.dataset.head = sec === rounds && rounds.classList.contains('is-dark') ? 'dark' : sec.dataset.theme;
    } });
  });

  /* ── rail: progress, ticks, current label ────────────────────────── */
  var fill = $('#railFill'), railLabel = $('#railLabel'), ticks = {};
  $$('#railTicks a').forEach(function (a) { ticks[a.dataset.tick] = a; });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { fill.style.transform = 'scaleY(' + s.progress.toFixed(4) + ')'; } });
  $$('[data-section]').forEach(function (s) {
    ScrollTrigger.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: function (st) {
      if (!st.isActive) return;
      var name = s.dataset.section;
      Object.keys(ticks).forEach(function (k) { ticks[k].classList.toggle('is-here', k === name); });
      if (railLabel.textContent !== s.dataset.label) {
        gsap.to(railLabel, { opacity: 0, y: -8, duration: .2, onComplete: function () { railLabel.textContent = s.dataset.label; gsap.fromTo(railLabel, { y: 8 }, { opacity: 1, y: 0, duration: .35 }); } });
      }
    } });
  });

  ScrollTrigger.sort();

  /* ── refresh once fonts and images settle ────────────────────────── */
  ScrollTrigger.refresh();
  function afterLoad() {
    ScrollTrigger.refresh();
    // deep links (#services etc.) land correctly after pins are measured
    if (location.hash && $(location.hash)) setTimeout(function () { scrollToTarget($(location.hash), { immediate: true }); }, 60);
    var at = params.get('at');
    if (at) setTimeout(function () {
      var t = /^\d+$/.test(at) ? +at : $('#' + at);
      scrollToTarget(t, { immediate: true });
    }, 200);
  }
  if (document.readyState === 'complete') afterLoad(); else addEventListener('load', afterLoad);
  }

  // SplitText measures lines, so it waits for the real fonts (max 1.5s)
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1500); })]).then(startMotion);
}());
