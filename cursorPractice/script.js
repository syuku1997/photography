(function () {
  'use strict';

  var HEADER_SCROLL_THRESHOLD = 60;
  var THEME_KEY = 'syuku-theme';

  // ---------- Theme (day / night) ----------
  function getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  }
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    try {
      localStorage.setItem(THEME_KEY, theme === 'dark' ? 'dark' : 'light');
    } catch (e) {}
  }
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    setTheme(getTheme());
    themeToggle.addEventListener('click', function () {
      var next = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // ---------- Header scroll ----------
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > HEADER_SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Gallery carousel ----------
  var track = document.getElementById('galleryTrack');
  var counterEl = document.getElementById('galleryCounter');
  var progressDot = document.getElementById('galleryProgressDot');
  var metaEl = document.getElementById('galleryMeta');
  if (track && counterEl && progressDot && metaEl) {
    var slides = track.querySelectorAll('.gallery-slide');
    var total = slides.length;
    var current = 0;
    var isAnimating = false;

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }
    function setSlide(index) {
      if (isAnimating) return;
      index = (index + total) % total;
      if (index === current) return;
      isAnimating = true;
      slides[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      counterEl.textContent = pad(current + 1) + ' / ' + pad(total);
      var slide = slides[current];
      var ja = slide.getAttribute('data-meta-ja') || '';
      var en = slide.getAttribute('data-meta-en') || '';
      var date = slide.getAttribute('data-meta-date') || '';
      var desc = (slide.getAttribute('data-meta-desc') || '').replace(/\|/g, '\n');
      var jaEl = metaEl.querySelector('.gallery-meta-ja');
      var enEl = metaEl.querySelector('.gallery-meta-en');
      var dateEl = metaEl.querySelector('.gallery-meta-date');
      var descEl = metaEl.querySelector('.gallery-meta-desc');
      if (jaEl) jaEl.textContent = ja;
      if (enEl) enEl.textContent = en;
      if (dateEl) dateEl.textContent = date;
      if (descEl) {
        descEl.textContent = desc;
        descEl.style.display = desc ? 'block' : 'none';
      }
      var progressBar = progressDot.parentElement;
      if (progressBar) {
        var pct = total <= 1 ? 0 : (current / (total - 1)) * 100;
        progressDot.style.left = pct + '%';
      }
      setTimeout(function () {
        isAnimating = false;
      }, 600);
    }

    var prevBtn = document.querySelector('.gallery-arrow-prev');
    var nextBtn = document.querySelector('.gallery-arrow-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { setSlide(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setSlide(current + 1); });

    var startX = 0;
    var startScroll = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) setSlide(current - 1);
        else setSlide(current + 1);
      }
    }, { passive: true });

    slides[0].classList.add('active');
    progressDot.style.left = total <= 1 ? '0%' : '0%';
  }

  // ---------- Hamburger menu ----------
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Section reveal on scroll ----------
  var sections = document.querySelectorAll('.section-reveal');
  var reveal = function () {
    var vh = window.innerHeight;
    sections.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.85) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('load', reveal);
  reveal();
})();
