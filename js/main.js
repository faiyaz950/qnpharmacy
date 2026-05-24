/* ============================================================
   QN PHARMA — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── PAGE LOADER ─── */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('out'), 1600);
    });
    setTimeout(() => loader.classList.add('out'), 3000);
  }

  /* ─── CUSTOM CURSOR ─── */
  const cur = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (cur && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animCursor() {
      cur.style.left  = mx + 'px'; cur.style.top  = my + 'px';
      rx += (mx - rx) * .14;   ry += (my - ry) * .14;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    })();
    document.querySelectorAll('a,button,.btn,.gal-item,.srv-card,.cat-card,.con-card,.why-card,.vid-play-ov').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ─── NAVBAR SCROLL ─── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const solidify = () => nav.classList.toggle('solid', window.scrollY > 60);
    window.addEventListener('scroll', solidify, { passive: true });
    solidify();
  }

  /* ─── ACTIVE NAV LINK ─── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('on');
  });

  /* ─── MOBILE DRAWER ─── */
  const ham     = document.querySelector('.ham');
  const drawer  = document.querySelector('.drawer');
  const dclose  = document.querySelector('.drawer-close');
  const overlay = document.querySelector('.drawer-overlay');
  function openDrawer()  { drawer?.classList.add('open'); overlay?.classList.add('vis'); setTimeout(() => overlay?.classList.add('in'),  10); }
  function closeDrawer() { drawer?.classList.remove('open'); overlay?.classList.remove('in'); setTimeout(() => overlay?.classList.remove('vis'), 400); }
  ham?.addEventListener('click', openDrawer);
  dclose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  /* ─── CANVAS PARTICLES ─── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize(); window.addEventListener('resize', resize);
    function mkPt() {
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * Math.PI * 2,
        s: (Math.random() * .4 + .15) * (Math.random() < .5 ? 1 : -1),
        vy: -(Math.random() * .5 + .15),
        op: Math.random() * .6 + .2,
      };
    }
    for (let i = 0; i < 60; i++) pts.push(mkPt());
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.a += p.s * .012; p.y += p.vy;
        p.x += Math.sin(p.a) * .4;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.op})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ─── SCROLL REVEAL ─── */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  /* ─── STATS COUNTER ─── */
  const statNums = document.querySelectorAll('.stat-n[data-val]');
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.val, suffix = el.dataset.suf || '';
      let cur = 0, dur = 1800, step = Math.ceil(target / (dur / 16));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(t);
      }, 16);
      cntObs.unobserve(el);
    });
  }, { threshold: .5 });
  statNums.forEach(el => cntObs.observe(el));

  /* ─── LIGHTBOX WITH NAVIGATION ─── */
  const lb    = document.querySelector('.lb');
  const lbImg = document.querySelector('.lb-img');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');
  const lbCounter = document.querySelector('.lb-counter');
  if (lb) {
    const galItems = Array.from(document.querySelectorAll('.gal-item[data-src]'));
    let currentIndex = 0;

    function showImage(index) {
      if (galItems.length === 0) return;
      currentIndex = (index + galItems.length) % galItems.length;
      lbImg.src = galItems[currentIndex].dataset.src;
      if (lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${galItems.length}`;
    }

    galItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        currentIndex = idx;
        showImage(currentIndex);
        lb.classList.add('on');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLb = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
    const prevImg = () => showImage(currentIndex - 1);
    const nextImg = () => showImage(currentIndex + 1);

    lbClose?.addEventListener('click', closeLb);
    lbPrev?.addEventListener('click', e => { e.stopPropagation(); prevImg(); });
    lbNext?.addEventListener('click', e => { e.stopPropagation(); nextImg(); });
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'ArrowRight') nextImg();
    });
  }

  /* ─── VIDEO PLAY TOGGLE ─── */
  document.querySelectorAll('.vid-play-ov').forEach(ov => {
    ov.addEventListener('click', () => {
      const video = ov.previousElementSibling || ov.closest('.vid-wrap')?.querySelector('video');
      if (!video) return;
      video.muted = false;
      video.volume = 0.85;
      video.play().then(() => ov.classList.add('gone')).catch(() => {});
      video.addEventListener('pause', () => ov.classList.remove('gone'));
      video.addEventListener('ended', () => ov.classList.remove('gone'));
    });
  });

  /* ─── CONTACT FORM ─── */
  const form   = document.querySelector('.con-form');
  const formOk = document.querySelector('.f-ok');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.f-submit');
      btn.textContent = 'Sending…'; btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        if (formOk) formOk.classList.add('show');
      }, 1200);
    });
  }

  /* ─── SMOOTH SCROLL for anchors ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ─── THEME TOGGLE ─── */
  const themeBtn = document.querySelector('.theme-toggle');
  function updateThemeIcon() {
    if (!themeBtn) return;
    const isLight = document.documentElement.classList.contains('light');
    themeBtn.innerHTML = isLight ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
  }
  updateThemeIcon();
  themeBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('qnpharma-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
  });

  /* ─── GOLD SHIMMER ON HOVER for buttons ─── */
  document.querySelectorAll('.btn-gold').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top ) / r.height * 100).toFixed(1);
      btn.style.setProperty('--mx', x + '%');
      btn.style.setProperty('--my', y + '%');
    });
  });

});
