/* ── Card JS ── */
(function () {

  /* ── Config ── */
  let C = { ...window.CARD_CONFIG_DEFAULT };
  const saved = sessionStorage.getItem('card_config');
  if (saved) { try { C = { ...C, ...JSON.parse(saved) }; } catch (_) {} }

  /* ── CSS vars ── */
  const root = document.documentElement;
  root.style.setProperty('--primary', C.primaryColor);
  root.style.setProperty('--accent',  C.accentColor);
  root.style.setProperty('--text',    C.textColor);
  root.style.setProperty('--bg',      C.bgColor);

  /* ══════════════════════════════════════
     TRANSICIÓN DE ENTRADA (fade-in)
  ══════════════════════════════════════ */
  const overlay = document.getElementById('js-page-transition');
  // Dispara el fade-out del overlay negro al cargar
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('done');
    });
  });

  /* ── Textos ── */
  setText('js-msg-to',   `Para ${C.recipientName} :`);
  setText('js-msg-body', C.message || '');
  setText('js-msg-from', `Con todo mi amor, ${C.senderName} 💕`);
  setText('js-hearts',   '♥ ♥ ♥');
  setText('js-closing',  `Te amo, ${C.recipientName} ♥`);

  /* ── Botón volver con fade-out ── */
  const backBtn = document.getElementById('js-back');
  backBtn.href = '#';
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.remove('done'); // vuelve a negro
    setTimeout(() => {
      window.location.href = C.backUrl || 'index.html';
    }, 600);
  });

  /* ══════════════════════════════════════
     SLIDESHOW DE FONDO
  ══════════════════════════════════════ */
  const useBgPhotos = C.showBgPhotos !== false;
  const bgImages    = (C.bgImages && C.bgImages.length > 0) ? C.bgImages : [];
  const slides      = document.querySelectorAll('.bg-slide');
  const slideshow   = document.querySelector('.bg-slideshow');

  if (useBgPhotos && bgImages.length > 0) {
    slides.forEach((slide, i) => {
      slide.style.backgroundImage = `url('${bgImages[i % bgImages.length]}')`;
    });
    let current = 0;
    const total = Math.min(slides.length, bgImages.length);
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % total;
      slides[current].classList.add('active');
    }, 6000);
  } else {
    slideshow.classList.add('color-only');
  }

  /* ══════════════════════════════════════
     MÚSICA — arranca con fade-in de volumen
  ══════════════════════════════════════ */
  const audio     = document.getElementById('card-music');
  const toggleBtn = document.getElementById('js-music-toggle');
  const musicIcon = document.getElementById('js-music-icon');
  const wave      = document.getElementById('js-music-wave');
  const musicBar  = document.getElementById('js-music-bar');

  const musicSrc = sessionStorage.getItem('card_music_src') || C.musicUrl;
  const autoplay = sessionStorage.getItem('card_music_autoplay') ?? String(C.musicAutoplay);

  if (musicSrc) {
    audio.src    = musicSrc;
    audio.loop   = C.musicLoop;
    audio.volume = 0;
    musicBar.style.display = 'flex';

    if (autoplay === 'true' || autoplay === true) {
      /* espera a que la página esté visible, luego sube volumen suavemente */
      audio.play().catch(() => {});
      const FADE_DURATION = 1800; // ms
      const STEPS         = 40;
      const STEP_TIME     = FADE_DURATION / STEPS;
      let step = 0;
      const fadeIn = setInterval(() => {
        step++;
        audio.volume = Math.min(1, step / STEPS);
        if (step >= STEPS) clearInterval(fadeIn);
      }, STEP_TIME);
    }
  } else {
    musicBar.style.display = 'none';
  }

  function updateMusicUI() {
    if (audio.paused) { musicIcon.textContent = '▶'; wave.classList.add('paused'); }
    else              { musicIcon.textContent = '⏸'; wave.classList.remove('paused'); }
  }
  toggleBtn.addEventListener('click', () => { audio.paused ? audio.play() : audio.pause(); updateMusicUI(); });
  audio.addEventListener('play',  updateMusicUI);
  audio.addEventListener('pause', updateMusicUI);
  updateMusicUI();

  /* ══════════════════════════════════════
     PARTÍCULAS
  ══════════════════════════════════════ */
  if (C.showParticles !== false) initParticles();

  function initParticles() {
    const canvas = document.getElementById('card-particles');
    const ctx    = canvas.getContext('2d');
    let W, H, particles;

    const EMOJIS = ['🌸','🌷','🌹','💖','💕','✦','❀','🌺','⭐','🌼','💫','✨','🌟','🩷','🫧'];
    const SHAPES = ['heart', 'circle', 'star', 'sparkle'];
    const TOTAL  = 90;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function mkP() {
      const isEmoji = Math.random() < 0.65;
      return {
        x   : Math.random() * W,
        y   : H + 20 + Math.random() * H * 0.4,
        size: isEmoji ? (10 + Math.random() * 18) : (3 + Math.random() * 10),
        vx  : (Math.random() - .5) * .55,
        vy  : -(0.3 + Math.random() * 0.75),
        op  : 0.15 + Math.random() * 0.5,
        rot : Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * .025,
        kind: isEmoji ? 'emoji' : SHAPES[Math.floor(Math.random() * SHAPES.length)],
        sym : EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        hue : 320 + Math.random() * 60,
      };
    }

    function drawHeart(x, y, s) {
      const r = s * 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y + r * 0.3);
      ctx.bezierCurveTo(x, y - r * 0.3, x - r, y - r * 0.3, x - r, y + r * 0.15);
      ctx.bezierCurveTo(x - r, y + r * 0.65, x, y + r * 1.1, x, y + r * 1.2);
      ctx.bezierCurveTo(x, y + r * 1.1, x + r, y + r * 0.65, x + r, y + r * 0.15);
      ctx.bezierCurveTo(x + r, y - r * 0.3, x, y - r * 0.3, x, y + r * 0.3);
      ctx.closePath();
    }
    function drawStar(x, y, s) {
      const r1 = s * 0.5, r2 = s * 0.22;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const a2 = ((i * 4 + 2) * Math.PI / 5) - Math.PI / 2;
        ctx.lineTo(x + r1 * Math.cos(a1), y + r1 * Math.sin(a1));
        ctx.lineTo(x + r2 * Math.cos(a2), y + r2 * Math.sin(a2));
      }
      ctx.closePath();
    }
    function drawSparkle(x, y, s) {
      const r = s * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const aOut = (i * Math.PI / 2) - Math.PI / 4;
        const aIn  = aOut + Math.PI / 4;
        ctx.lineTo(x + r * Math.cos(aOut),        y + r * Math.sin(aOut));
        ctx.lineTo(x + r * 0.18 * Math.cos(aIn),  y + r * 0.18 * Math.sin(aIn));
      }
      ctx.closePath();
    }

    function init() {
      resize();
      particles = Array.from({ length: TOTAL }, mkP);
      particles.forEach(p => { p.y = Math.random() * H; });
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.rot += p.spin;
        if (p.y < -30) { Object.assign(p, mkP()); p.y = H + 15; }
        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.kind === 'emoji') {
          ctx.font = `${p.size}px serif`;
          ctx.fillText(p.sym, -p.size * 0.5, p.size * 0.4);
        } else if (p.kind === 'heart') {
          drawHeart(0, -p.size * 0.5, p.size);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 1)`; ctx.fill();
        } else if (p.kind === 'circle') {
          ctx.beginPath(); ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, 1)`; ctx.fill();
        } else if (p.kind === 'star') {
          drawStar(0, 0, p.size);
          ctx.fillStyle = `hsla(${p.hue + 10}, 75%, 72%, 1)`; ctx.fill();
        } else {
          drawSparkle(0, 0, p.size);
          ctx.fillStyle = `hsla(${p.hue + 20}, 90%, 85%, 1)`; ctx.fill();
        }
        ctx.restore();
      }
      requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    init();
    step();
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

})();