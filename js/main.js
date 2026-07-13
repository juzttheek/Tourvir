/* ============================================
   Tourvir — Main JavaScript
   Theme Switcher, Sidebar, Global Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initHeader();
  initBackToTop();
  initScrollReveal();
  initFeedbackForm();
});

/* ---------- Theme Management ---------- */
function initTheme() {
  const saved = localStorage.getItem('Tourvir-theme') || 'light';
  setTheme(saved);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('Tourvir-theme', theme);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    if (theme === 'dark') {
      themeToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
    } else {
      themeToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
    }
  }
}

/* ---------- Sidebar ---------- */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const hamburger = document.querySelector('.hamburger');
  const closeBtn = document.querySelector('.sidebar__close');
  
  if (!sidebar || !hamburger) return;
  
  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  hamburger.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
  
  // Close sidebar on nav link click (mobile)
  sidebar.querySelectorAll('.sidebar__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
}

/* ---------- Header Scroll Effect ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if (!reveals.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(el => observer.observe(el));
}

/* ---------- Toast Notifications ---------- */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${message}</span>
    <span class="toast__close" onclick="this.parentElement.remove()">✕</span>
  `;
  
  container.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ---------- Counter Animation ---------- */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count, 10);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
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

// Init counters when stats section is visible
function initCounterObserver() {
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(statsSection);
}

// Call counter observer on load
document.addEventListener('DOMContentLoaded', initCounterObserver);

/* ---------- Testimonial Carousel ---------- */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonials__track');
  const dots = document.querySelectorAll('.testimonials__dot');
  
  if (!track || !dots.length) return;
  
  let currentSlide = 0;
  const slideCount = dots.length;
  
  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
  
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });
  
  // Auto-advance
  setInterval(() => {
    goToSlide((currentSlide + 1) % slideCount);
  }, 5000);
}

document.addEventListener('DOMContentLoaded', initTestimonialCarousel);

/* ---------- Feedback Form ---------- */
function initFeedbackForm() {
  const starsContainer = document.getElementById('feedback-stars');
  const ratingInput = document.getElementById('feedback-rating');
  const form = document.getElementById('feedback-form');
  const successEl = document.getElementById('feedback-success');
  const resetBtn = document.getElementById('feedback-reset');

  if (!starsContainer || !form) return;

  const stars = starsContainer.querySelectorAll('.feedback-form__star');
  let currentRating = 0;

  // Star hover effect
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      stars.forEach(s => {
        s.classList.toggle('hovered', parseInt(s.dataset.rating) <= rating);
      });
    });

    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.rating);
      if (ratingInput) ratingInput.value = currentRating;
      stars.forEach(s => {
        const r = parseInt(s.dataset.rating);
        s.classList.toggle('active', r <= currentRating);
      });
    });
  });

  starsContainer.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hovered'));
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (currentRating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }

    // Simulate submission (no backend)
    const submitBtn = document.getElementById('feedback-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting...';

    setTimeout(() => {
      form.style.display = 'none';
      if (successEl) successEl.style.display = 'block';
    }, 1200);
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      currentRating = 0;
      if (ratingInput) ratingInput.value = 0;
      stars.forEach(s => s.classList.remove('active'));
      form.style.display = '';
      if (successEl) successEl.style.display = 'none';
      const submitBtn = document.getElementById('feedback-submit');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> Submit Feedback';
    });
  }
}
