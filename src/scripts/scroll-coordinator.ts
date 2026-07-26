/* ============================================
   Tourvir — Throttled Scroll & Reveal Coordinator
   ============================================ */

export function initHeaderScroll(): void {
  const header = document.querySelector('.header') as HTMLElement | null;
  if (!header) return;

  let ticking = false;

  const update = () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
}

export function initBackToTop(): void {
  const btn = document.querySelector('.back-to-top') as HTMLElement | null;
  if (!btn) return;

  let ticking = false;

  const update = () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function initScrollReveal(): void {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  );

  reveals.forEach((el) => observer.observe(el));
}

export function animateCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');

  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count || '0', 10);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(start + (target - start) * eased);

      counter.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString() + (counter.dataset.suffix || '');
      }
    }

    requestAnimationFrame(update);
  });
}

export function initCounterObserver(): void {
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(statsSection);
}

export function initScrollCoordinator(): void {
  initHeaderScroll();
  initBackToTop();
  initScrollReveal();
  initCounterObserver();
}
