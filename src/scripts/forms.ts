/* ============================================
   Tourvir — Form Validation & Interaction Handlers
   ============================================ */

import { showToast } from './status-toast.js';

export const FORM_SCHEMAS = {
  contact: ['contact-name', 'contact-email', 'contact-subject', 'contact-message'],
  inquiry: [
    'full-name',
    'email',
    'nationality',
    'phone',
    'arrival-date',
    'departure-date',
    'travelers',
    'vehicle-pref',
    'special-requirements',
  ],
  feedback: [
    'feedback-name',
    'feedback-country',
    'feedback-tour',
    'feedback-rating',
    'feedback-message',
  ],
} as const;

export type FormKind = keyof typeof FORM_SCHEMAS;

export function serializeApprovedForm(
  form: HTMLFormElement,
  kind: FormKind,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const id of FORM_SCHEMAS[kind]) {
    const control = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `#${id}`,
    );
    if (control) result[id] = control.value.trim();
  }
  return result;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function initFeedbackForm(): void {
  const starsContainer = document.getElementById('feedback-stars');
  const ratingInput = document.getElementById('feedback-rating') as HTMLInputElement | null;
  const form = document.getElementById('feedback-form') as HTMLFormElement | null;
  if (!starsContainer || !form) return;

  const stars = starsContainer.querySelectorAll<HTMLElement>('.feedback-form__star');
  let currentRating = 0;

  stars.forEach((star) => {
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating || '0', 10);
      stars.forEach((s) => {
        s.classList.toggle('hovered', parseInt(s.dataset.rating || '0', 10) <= rating);
      });
    });

    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.rating || '0', 10);
      if (ratingInput) ratingInput.value = String(currentRating);
      stars.forEach((s) => {
        const r = parseInt(s.dataset.rating || '0', 10);
        s.classList.toggle('active', r <= currentRating);
      });
    });
  });

  starsContainer.addEventListener('mouseleave', () => {
    stars.forEach((s) => s.classList.remove('hovered'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serializeApprovedForm(form, 'feedback');

    if (currentRating === 0) {
      showToast('Please select a star rating before submitting.', 'error');
      return;
    }

    showToast('Online feedback is temporarily unavailable. Please email hello@Tourvir.lk.', 'info');
  });
}

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serializeApprovedForm(form, 'contact');

    const required = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]');
    let valid = true;

    required.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      } else {
        input.classList.remove('error');
      }
    });

    const email = form.querySelector<HTMLInputElement>('input[type="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
      email.classList.add('error');
      valid = false;
    }

    if (!valid) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }

    showToast(
      'Online messaging is temporarily unavailable. Please email hello@Tourvir.lk or use WhatsApp.',
      'info',
    );
  });
}

export function initMultiStepForm(): void {
  const form = document.getElementById('inquiry-form') as HTMLFormElement | null;
  if (!form) return;

  const steps = form.querySelectorAll<HTMLElement>('.form-step');
  const progressSteps = document.querySelectorAll<HTMLElement>('.progress-step');
  const progressLines = document.querySelectorAll<HTMLElement>('.progress-step__line');
  let currentStep = 0;

  function showStep(index: number) {
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

    if (index === steps.length - 1) {
      populateReview();
    }
  }

  function validateStep(index: number): boolean {
    const step = steps[index];
    if (!step) return false;

    const required = step.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('[required]');
    let valid = true;

    required.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      } else {
        input.classList.remove('error');
      }
    });

    const email = step.querySelector<HTMLInputElement>('input[type="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
      email.classList.add('error');
      valid = false;
    }

    const arrival = step.querySelector<HTMLInputElement>('#arrival-date');
    const departure = step.querySelector<HTMLInputElement>('#departure-date');
    if (arrival?.value && departure?.value && departure.value < arrival.value) {
      departure.classList.add('error');
      showToast('Departure date must be after the arrival date', 'error');
      valid = false;
    }

    if (!valid) {
      showToast('Please fill in all required fields correctly', 'error');
    }

    return valid;
  }

  function populateReview() {
    const fields: Record<string, string> = {
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
      const inputEl = document.getElementById(inputId) as
        HTMLInputElement | HTMLSelectElement | null;
      if (reviewEl && inputEl) {
        reviewEl.textContent = inputEl.value || '—';
      }
    });

    const selectedInterests = document.querySelectorAll('.interest-tag.selected');
    const reviewInterests = document.getElementById('review-interests');
    if (reviewInterests) {
      reviewInterests.textContent = selectedInterests.length
        ? Array.from(selectedInterests)
            .map((t) => t.textContent)
            .join(', ')
        : '—';
    }

    const selectedAccom = document.querySelector('.accommodation-option.selected');
    const reviewAccom = document.getElementById('review-accommodation');
    if (reviewAccom) {
      const label = selectedAccom?.querySelector('.accommodation-option__label');
      reviewAccom.textContent = label ? label.textContent : '—';
    }

    const specialReq = document.getElementById(
      'special-requirements',
    ) as HTMLTextAreaElement | null;
    const reviewSpecial = document.getElementById('review-special');
    if (reviewSpecial) {
      reviewSpecial.textContent = specialReq && specialReq.value ? specialReq.value : '—';
    }
  }

  document.querySelectorAll('[data-action="next"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('[data-action="prev"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showStep(currentStep - 1);
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serializeApprovedForm(form, 'inquiry');
    showToast(
      'Online inquiries are temporarily unavailable. Please email hello@Tourvir.lk or use WhatsApp.',
      'info',
    );
  });

  showStep(0);
}

export function initInterestTags(): void {
  document.querySelectorAll('.interest-tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
    });
  });
}

export function initAccommodationOptions(): void {
  document.querySelectorAll('.accommodation-option').forEach((option) => {
    option.addEventListener('click', () => {
      document
        .querySelectorAll('.accommodation-option')
        .forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

export function initAccordion(): void {
  document.querySelectorAll<HTMLElement>('.accordion__header').forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion__item') as HTMLElement | null;
      if (!item) return;

      const body = item.querySelector('.accordion__body') as HTMLElement | null;
      if (!body) return;

      const isActive = item.classList.contains('active');

      document.querySelectorAll<HTMLElement>('.accordion__item').forEach((i) => {
        i.classList.remove('active');
        const b = i.querySelector('.accordion__body') as HTMLElement | null;
        if (b) b.style.maxHeight = '';
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

export function initFormHandlers(): void {
  initFeedbackForm();
  initContactForm();
  initMultiStepForm();
  initInterestTags();
  initAccommodationOptions();
  initAccordion();
}
