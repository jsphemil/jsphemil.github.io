(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (initial theme is applied inline in <head> to avoid a flash)
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    });
  });

  // Mobile nav
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  if (menu && header) {
    menu.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      menu.setAttribute('aria-expanded', open);
    });
    header.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => {
        header.classList.remove('nav-open');
        menu.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Header border once scrolled
  const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  const items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  }

  // Gentle parallax on large images
  if (!reduce) {
    const par = [...document.querySelectorAll('.parallax img')];
    if (par.length) {
      let ticking = false;
      const update = () => {
        const vh = innerHeight;
        par.forEach(img => {
          const r = img.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          img.style.transform = `translateY(${(p * -6).toFixed(2)}%) scale(1.12)`;
        });
        ticking = false;
      };
      addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    }
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
