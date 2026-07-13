/* ============================================
   Tourvir — Inquiry Page JavaScript
   Multi-step Form Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMultiStepForm();
  initInterestTags();
  initAccommodationOptions();
});

/* ---------- Multi-Step Form ---------- */
function initMultiStepForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  
  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-step__line');
  let currentStep = 0;
  
  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
    
    progressSteps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < index) step.classList.add('completed');
      if (i === index) step.classList.add('active');
    });
    
    progressLines.forEach((line, i) => {
      line.classList.toggle('completed', i < index);
    });
    
    currentStep = index;
    
    // Update review if on last step
    if (index === steps.length - 1) {
      populateReview();
    }
  }
  
  function validateStep(index) {
    const step = steps[index];
    const required = step.querySelectorAll('[required]');
    let valid = true;
    
    required.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    // Email validation
    const email = step.querySelector('input[type="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
      email.classList.add('error');
      valid = false;
    }
    
    if (!valid) {
      showToast('Please fill in all required fields', 'error');
    }
    
    return valid;
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function populateReview() {
    const fields = {
      'review-name': 'full-name',
      'review-email': 'email',
      'review-nationality': 'nationality',
      'review-phone': 'phone',
      'review-arrival': 'arrival-date',
      'review-departure': 'departure-date',
      'review-travelers': 'travelers',
    };
    
    Object.entries(fields).forEach(([reviewId, inputId]) => {
      const reviewEl = document.getElementById(reviewId);
      const inputEl = document.getElementById(inputId);
      if (reviewEl && inputEl) {
        reviewEl.textContent = inputEl.value || '—';
      }
    });
    
    // Interests
    const selectedInterests = document.querySelectorAll('.interest-tag.selected');
    const reviewInterests = document.getElementById('review-interests');
    if (reviewInterests) {
      reviewInterests.textContent = selectedInterests.length 
        ? Array.from(selectedInterests).map(t => t.textContent).join(', ')
        : '—';
    }
    
    // Accommodation
    const selectedAccom = document.querySelector('.accommodation-option.selected');
    const reviewAccom = document.getElementById('review-accommodation');
    if (reviewAccom) {
      reviewAccom.textContent = selectedAccom 
        ? selectedAccom.querySelector('.accommodation-option__label').textContent 
        : '—';
    }
    
    // Special requirements
    const specialReq = document.getElementById('special-requirements');
    const reviewSpecial = document.getElementById('review-special');
    if (reviewSpecial) {
      reviewSpecial.textContent = specialReq && specialReq.value ? specialReq.value : '—';
    }
  }
  
  // Next/Prev buttons
  document.querySelectorAll('[data-action="next"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });
  
  document.querySelectorAll('[data-action="prev"]').forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(currentStep - 1);
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    });
  });
  
  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Your inquiry has been submitted successfully! We\'ll contact you within 24 hours.', 'success');
    
    // Reset form
    setTimeout(() => {
      form.reset();
      document.querySelectorAll('.interest-tag').forEach(t => t.classList.remove('selected'));
      document.querySelectorAll('.accommodation-option').forEach(o => o.classList.remove('selected'));
      showStep(0);
    }, 2000);
  });
  
  // Initialize first step
  showStep(0);
}

/* ---------- Interest Tags ---------- */
function initInterestTags() {
  document.querySelectorAll('.interest-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
    });
  });
}

/* ---------- Accommodation Options ---------- */
function initAccommodationOptions() {
  document.querySelectorAll('.accommodation-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.accommodation-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

/* ---------- FAQ Accordion ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion__item');
      const body = item.querySelector('.accordion__body');
      const isActive = item.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.accordion__item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion__body').style.maxHeight = null;
      });
      
      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
});
