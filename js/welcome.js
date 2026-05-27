/* ── Welcome JS ── */
(function () {
  const C = window.CARD_CONFIG;

  /* ── CSS vars ── */
  const root = document.documentElement;
  root.style.setProperty('--primary', C.primaryColor);
  root.style.setProperty('--accent',  C.accentColor);
  root.style.setProperty('--text',    C.textColor);

  /* ── Imagen de fondo ── */
  if (C.welcomeBg) {
    document.body.style.setProperty('--bg-image', `url('${C.welcomeBg}')`);
  }

  /* ══════════════════════════════════════
     TRANSICIÓN DE ENTRADA (fade-in)
  ══════════════════════════════════════ */
  const overlay = document.getElementById('js-page-transition');
  setTimeout(() => { overlay.classList.add('done'); }, 60);

  /* ── Textos ── */
  document.getElementById('js-headline').textContent = C.welcomeHeadline;
  document.getElementById('js-subtitle').textContent = C.welcomeSubtitle;
  document.getElementById('js-btn-text').textContent = C.enterButtonText;
  document.getElementById('js-sender').textContent   = `Con amor, ${C.senderName}`;

  /* ══════════════════════════════════════
     IR A LA TARJETA con fade-out suave
  ══════════════════════════════════════ */
  function goToCard() {
    if (C.musicUrl) {
      sessionStorage.setItem('card_music_src',      C.musicUrl);
      sessionStorage.setItem('card_music_autoplay', String(C.musicAutoplay));
      sessionStorage.setItem('card_music_loop',     String(C.musicLoop));
    }
    sessionStorage.setItem('card_config', JSON.stringify(C));

    overlay.classList.remove('done');
    setTimeout(() => {
      window.location.href = C.cardUrl;
    }, 600);
  }

  document.getElementById('js-enter-btn').addEventListener('click', goToCard);
  document.getElementById('js-envelope').addEventListener('click', goToCard);

  /* ── Partículas ── */
  if (C.particles) initParticles();

  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles;

    /* Símbolos de texto — blancos y lavanda claro sobre fondo oscuro violeta */
    const SYMBOLS = ['♥','♡','✦','✧','⋆','·','❀','✿','◇','○','★','☆','∗','•'];
    const TOTAL   = 160;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function mkP() {
      const size = 7 + Math.random() * 24;
      return {
        x   : Math.random() * W,
        y   : H + 20 + Math.random() * H * 0.5,
        size,
        vx  : (Math.random() - .5) * .65,
        vy  : -(0.38 + Math.random() * 1.1),
        op  : 0.18 + Math.random() * 0.62,
        rot : Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * .028,
        sym : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        /* 45% blanco puro, 55% lavanda claro */
        sat  : Math.random() < 0.45 ? 0 : 55,
        light: 88 + Math.random() * 12,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: TOTAL }, mkP);
      particles.forEach(p => { p.y = Math.random() * H; });
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.spin;
        if (p.y < -30) { Object.assign(p, mkP()); p.y = H + 15; }

        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font      = `${p.size}px serif`;
        ctx.fillStyle = `hsl(270, ${p.sat}%, ${p.light}%)`;
        ctx.fillText(p.sym, -p.size * 0.35, p.size * 0.35);
        ctx.restore();
      }
      requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    init();
    step();
  }
})();