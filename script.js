/* ═══════════════════════════════════════════════════════════
   PP Studio – Pretty Petals  |  script.js
════════════════════════════════════════════════════════════ */

/* ── Petal generator ──────────────────────────────────────── */
(function spawnPetals() {
  const container = document.getElementById('petalContainer');
  if (!container) return;

  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'petal';

    const size  = 6 + Math.random() * 12;
    const delay = Math.random() * 20;
    const dur   = 12 + Math.random() * 16;
    const left  = Math.random() * 100;
    const hue   = 340 + Math.random() * 20;
    const sat   = 70 + Math.random() * 20;
    const lit   = 75 + Math.random() * 15;

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background: hsl(${hue},${sat}%,${lit}%);
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ── Sticky nav ───────────────────────────────────────────── */
(function stickyNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile burger ────────────────────────────────────────── */
(function mobileMenu() {
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
    })
  );
})();

/* ── Hero slideshow ───────────────────────────────────────── */
(function heroSlideshow() {
  const imgs  = document.querySelectorAll('.hero-img');
  if (!imgs.length) return;
  let current = 0;

  setInterval(() => {
    imgs[current].classList.remove('active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('active');
  }, 5000);
})();

/* ── Scroll-reveal ────────────────────────────────────────── */
(function scrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });

  /* stagger siblings inside the same parent */
  const groups = new Map();
  els.forEach(el => {
    const key = el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  groups.forEach(group =>
    group.forEach((el, i) => { el.dataset.delay = i * 80; })
  );

  els.forEach(el => io.observe(el));
})();

/* ── Counter animation ────────────────────────────────────── */
(function counters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const start  = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();

/* ── Testimonial slider ───────────────────────────────────── */
(function testiSlider() {
  const track  = document.getElementById('testiCards');
  const dotsEl = document.getElementById('testiDots');
  if (!track || !dotsEl) return;

  const cards   = track.querySelectorAll('.testi-card');
  const perView = window.innerWidth <= 768 ? 1 : 3;
  const total   = Math.ceil(cards.length / perView);
  let current   = 0;

  /* build dots */
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'testi-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(btn);
  }

  function goTo(idx) {
    current = idx;
    const offset = (100 / perView) * perView * idx;
    track.style.transform = `translateX(-${offset}%)`;
    dotsEl.querySelectorAll('.testi-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
  }

  /* auto-advance */
  let timer = setInterval(() => goTo((current + 1) % total), 4500);
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo((current + 1) % total), 4500);
  });

  /* touch swipe */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? Math.min(current + 1, total - 1) : Math.max(current - 1, 0));
  });
})();

/* ── Booking form → WhatsApp ──────────────────────────────── */
(function bookingForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs  = form.querySelectorAll('input, select, textarea');
    const name    = inputs[0].value.trim();
    const phone   = inputs[1].value.trim();
    const service = inputs[2].value;
    const date    = inputs[3].value;
    const notes   = inputs[4].value.trim();

    const lines = [
      '👋 *New Appointment Request – PP Studio*',
      '',
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Service:* ${service}`,
      date ? `*Preferred Date:* ${date}` : '',
      notes ? `*Notes:* ${notes}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/919863069562?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener');
  });
})();

/* ── Smooth active nav link highlight ─────────────────────── */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${e.target.id}`) {
          a.style.color = 'var(--mauve)';
        }
      });
    });
  }, { rootMargin: '-45% 0px -45%' });

  sections.forEach(s => io.observe(s));
})();

/* ── Video autoplay on scroll + custom controls ────────────── */
(function videoAutoplay() {
  const videos = document.querySelectorAll('.reel-video');
  if (!videos.length) return;

  /* Inject controls into every video's parent container */
  videos.forEach(video => {
    const wrap = video.parentElement;
    wrap.style.position = 'relative';

    const ctrl = document.createElement('div');
    ctrl.className = 'video-controls';
    ctrl.innerHTML = `
      <button class="vc-btn vc-playpause" aria-label="Pause">
        <i class="fa-solid fa-pause"></i>
      </button>
      <button class="vc-btn vc-mute" aria-label="Mute">
        <i class="fa-solid fa-volume-high"></i>
      </button>`;
    wrap.appendChild(ctrl);

    const playBtn = ctrl.querySelector('.vc-playpause');
    const muteBtn = ctrl.querySelector('.vc-mute');

    /* Play / pause */
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        delete video.dataset.userPaused;
      } else {
        video.pause();
        video.dataset.userPaused = '1';
      }
    });

    /* Mute / unmute */
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.querySelector('i').className = video.muted
        ? 'fa-solid fa-volume-xmark'
        : 'fa-solid fa-volume-high';
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    });

    /* Keep icon in sync with actual video state */
    video.addEventListener('play',  () => {
      playBtn.querySelector('i').className = 'fa-solid fa-pause';
      playBtn.setAttribute('aria-label', 'Pause');
    });
    video.addEventListener('pause', () => {
      playBtn.querySelector('i').className = 'fa-solid fa-play';
      playBtn.setAttribute('aria-label', 'Play');
    });
  });

  /* Autoplay on scroll — respects manual pause */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (!e.target.dataset.userPaused) e.target.play();
      } else {
        e.target.pause();
      }
    });
  }, { threshold: 0.4 });

  videos.forEach(v => io.observe(v));
})();
