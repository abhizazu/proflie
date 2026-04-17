/* ============================================================
   ANTIGRAVITY PORTFOLIO — ABHISHEK DN — Interactive JS
   ============================================================ */

// ─── STAR FIELD ───────────────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.25 + 0.05,
        drift: (Math.random() - 0.5) * 0.15,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.twinkle += s.twinkleSpeed;
      const alphaMod = s.alpha + Math.sin(s.twinkle) * 0.18;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${Math.max(0, alphaMod)})`;
      ctx.fill();

      // Parallax with scroll
      s.y -= s.speed;
      s.x += s.drift;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      if (s.x < -2) s.x = W + 2;
      if (s.x > W + 2) s.x = -2;
    }
    requestAnimationFrame(drawStars);
  }

  resize();
  createStars(280);
  drawStars();
  window.addEventListener('resize', () => { resize(); createStars(280); });
})();


// ─── CURSOR TRAIL ──────────────────────────────────────────────
(function initCursor() {
  const canvas = document.getElementById('cursorCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const trail = [];
  const MAX_TRAIL = 28;
  let mx = -200, my = -200;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    trail.push({ x: mx, y: my, alpha: 1 });
    if (trail.length > MAX_TRAIL) trail.shift();
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Cursor dot
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 10);
    grad.addColorStop(0, 'rgba(139,92,246,0.95)');
    grad.addColorStop(0.4, 'rgba(6,182,212,0.5)');
    grad.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Trail
    for (let i = 0; i < trail.length; i++) {
      const t = trail[i];
      const progress = i / trail.length;
      const alpha = progress * 0.55;
      const r = progress * 6;
      const tg = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r + 2);
      tg.addColorStop(0, `rgba(139,92,246,${alpha})`);
      tg.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.beginPath();
      ctx.arc(t.x, t.y, r + 2, 0, Math.PI * 2);
      ctx.fillStyle = tg;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();


// ─── TYPEWRITER ────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'Building AI that ships to production.',
    'Zero-gravity engineering mindset.',
    'Cloud infra that scales without limits.',
    'Automating what humans shouldn\'t repeat.',
    'From idea → deployed in record time.',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 55);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 28);
    }
  }
  setTimeout(tick, 1200);
})();


// ─── PROJECT CARD 3D TILT ──────────────────────────────────────
(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const maxTilt = 12;
      card.style.transform = `
        perspective(900px)
        rotateY(${dx * maxTilt}deg)
        rotateX(${-dy * maxTilt}deg)
        translateZ(10px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();


// ─── ORBIT SKILL SYSTEM ────────────────────────────────────────
(function initOrbit() {
  const container = document.getElementById('orbitSystem');
  if (!container) return;

  const skillRings = [
    {
      radius: 110,
      duration: 18,
      type: 'violet-tag',
      skills: ['LLM APIs', 'Langchain', 'NLP', 'AI Agents'],
    },
    {
      radius: 185,
      duration: 28,
      type: 'cyan-tag',
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    },
    {
      radius: 258,
      duration: 40,
      type: 'white-tag',
      skills: ['Python', 'Flask', 'FastAPI', 'SQL', 'Git', 'Linux'],
    },
  ];

  skillRings.forEach((ring, ri) => {
    // Draw ring circle
    const ringEl = document.createElement('div');
    ringEl.className = 'orbit-ring';
    const size = ring.radius * 2;
    ringEl.style.width  = size + 'px';
    ringEl.style.height = size + 'px';
    container.appendChild(ringEl);

    const count = ring.skills.length;
    ring.skills.forEach((skill, si) => {
      const tag = document.createElement('div');
      tag.className = `skill-tag ${ring.type}`;
      tag.textContent = skill;
      container.appendChild(tag);

      const startAngle = (si / count) * 360;
      const dir = ri % 2 === 0 ? 1 : -1;

      let angle = startAngle;
      const speed = (360 / ring.duration) * dir * 0.016; // degrees per frame

      function animateTag() {
        angle += speed;
        const rad = (angle * Math.PI) / 180;
        const cx = Math.cos(rad) * ring.radius;
        const cy = Math.sin(rad) * ring.radius;

        // Center of orbit system
        const halfW = container.offsetWidth  / 2;
        const halfH = container.offsetHeight / 2;
        const halfTW = tag.offsetWidth  / 2;
        const halfTH = tag.offsetHeight / 2;

        tag.style.left = (halfW + cx - halfTW) + 'px';
        tag.style.top  = (halfH + cy - halfTH) + 'px';
        tag.style.position = 'absolute';
        requestAnimationFrame(animateTag);
      }
      requestAnimationFrame(animateTag);
    });
  });
})();


// ─── SCROLL REVEAL ─────────────────────────────────────────────
(function initReveal() {
  const revealEls = [
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.about-grid'),
    ...document.querySelectorAll('.contact-wrapper'),
    ...document.querySelectorAll('.section-header'),
    ...document.querySelectorAll('.skills-universe'),
  ];

  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => io.observe(el));
})();


// ─── PARALLAX ON SCROLL ────────────────────────────────────────
(function initParallax() {
  const heroBadges = document.querySelectorAll('.ambient-badge');
  const orbs = document.querySelectorAll('.hero-orb');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    heroBadges.forEach((b, i) => {
      const factor = 0.12 + i * 0.04;
      b.style.transform = `translateY(${sy * factor}px)`;
    });
    orbs.forEach((o, i) => {
      const factor = 0.06 + i * 0.03;
      o.style.transform = `translateY(${sy * factor}px)`;
    });
  }, { passive: true });
})();


// ─── NAV SCROLL STYLE ─────────────────────────────────────────
(function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(5,5,16,0.88)';
      nav.style.boxShadow = '0 4px 40px rgba(0,0,0,0.4)';
    } else {
      nav.style.background = 'rgba(5,5,16,0.6)';
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
})();


// ─── CONTACT FORM ──────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn = document.getElementById('submitBtn');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg   = document.getElementById('message').value.trim();
    if (!name || !email || !msg) return;

    btn.disabled = true;
    btn.innerHTML = '<span>Launching...</span><span class="btn-icon">🛸</span>';

    setTimeout(() => {
      form.reset();
      success.classList.remove('hidden');
      btn.innerHTML = '<span>Launch Message</span><span class="btn-icon">🚀</span>';
      btn.disabled = false;
      setTimeout(() => success.classList.add('hidden'), 4500);
    }, 1400);
  });
})();


// ─── MAGNETIC BUTTON EFFECT ────────────────────────────────────
(function initMagnetic() {
  const btns = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-pill');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
})();
