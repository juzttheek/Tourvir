/* ============================================
   Tourvir — Form Validation & Interaction Handlers
   ============================================ */

import { showToast } from './status-toast.js';
import { FORMS_CONFIG, isFormConfigured } from '../config/forms.js';
import { submitToFormspree } from '../services/forms-client.js';
import { validateContact, type ContactPayload } from '../schemas/contact.js';
import {
  validateInquiry,
  type IsoCountryCode,
  type Interest,
  type Accommodation,
  type InquiryPayload,
} from '../schemas/inquiry.js';
import { validateFeedback } from '../schemas/feedback.js';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function initFeedbackForm(): void {
  const form = document.getElementById('feedback-form') as HTMLFormElement | null;
  const starsContainer = document.getElementById('feedback-stars');
  const ratingInput = document.getElementById('feedback-rating') as HTMLInputElement | null;
  if (!form || !starsContainer) return;

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isFormConfigured('feedbackId')) {
      showToast(
        'Online feedback is temporarily unavailable. Please email prathibhatheekshana2021@gmail.com.',
        'error',
      );
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    const payload = {
      name: (form.querySelector('#feedback-name') as HTMLInputElement)?.value.trim() || '',
      tour: (form.querySelector('#feedback-tour') as HTMLSelectElement)?.value || '',
      rating: currentRating,
      comments:
        (form.querySelector('#feedback-message') as HTMLTextAreaElement)?.value.trim() || '',
      email: (form.querySelector('#feedback-email') as HTMLInputElement)?.value.trim() || '',
      country: (form.querySelector('#feedback-country') as HTMLInputElement)?.value.trim() || '',
      testimonialConsent:
        (form.querySelector('#feedback-consent') as HTMLInputElement)?.checked || false,
      _gotcha: (form.querySelector('input[name="_gotcha"]') as HTMLInputElement)?.value || '',
    };

    const errors = validateFeedback(payload);
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

    if (errors.length > 0) {
      showToast(errors[0]?.message || 'Validation error', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);

    const result = await submitToFormspree(FORMS_CONFIG.feedbackId!, payload, abortController);
    clearTimeout(timeout);

    if (result.success) {
      showToast(result.message, 'success');
      form.reset();
      currentRating = 0;
      stars.forEach((s) => s.classList.remove('active', 'hovered'));
    } else {
      showToast(result.message, 'error');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });
}

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isFormConfigured('contactId')) {
      showToast(
        'Online messaging is temporarily unavailable. Please email prathibhatheekshana2021@gmail.com.',
        'error',
      );
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    const payload = {
      name: (form.querySelector('#contact-name') as HTMLInputElement)?.value.trim() || '',
      email: (form.querySelector('#contact-email') as HTMLInputElement)?.value.trim() || '',
      phone: (form.querySelector('#contact-phone') as HTMLInputElement)?.value.trim() || '',
      subject: ((form.querySelector('#contact-subject') as HTMLSelectElement)?.value ||
        '') as ContactPayload['subject'],
      message: (form.querySelector('#contact-message') as HTMLTextAreaElement)?.value.trim() || '',
      privacyConsent:
        (form.querySelector('#contact-consent') as HTMLInputElement)?.checked || false,
      _gotcha: (form.querySelector('input[name="_gotcha"]') as HTMLInputElement)?.value || '',
    };

    const errors = validateContact(payload);
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

    if (errors.length > 0) {
      errors.forEach((err) => {
        let fieldEl;
        if (err.field === 'privacyConsent') fieldEl = form.querySelector('#contact-consent');
        else fieldEl = form.querySelector(`#contact-${err.field}`);

        if (fieldEl) fieldEl.classList.add('error');
      });
      showToast(errors[0]?.message || 'Validation error', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);

    const result = await submitToFormspree(FORMS_CONFIG.contactId!, payload, abortController);
    clearTimeout(timeout);

    if (result.success) {
      showToast(result.message, 'success');
      form.reset();
    } else {
      showToast(result.message, 'error');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
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
    const isForward = index >= currentStep;
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('active');
        step.setAttribute('data-direction', isForward ? 'forward' : 'backward');
      } else {
        step.classList.remove('active');
        step.removeAttribute('data-direction');
      }
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

    const progressContainer = document.querySelector('.progress-steps') as HTMLElement | null;
    if (progressContainer) {
      if (index === steps.length - 1) {
        progressContainer.style.display = 'none';
      } else {
        progressContainer.style.display = '';
      }
    }

    if (steps[index].hasAttribute('data-is-review')) {
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
      if (input.type === 'checkbox') {
        if (!(input as HTMLInputElement).checked) {
          input.classList.add('error');
          valid = false;
        } else {
          input.classList.remove('error');
        }
      } else {
        if (!input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else {
          input.classList.remove('error');
        }
      }
    });

    const email = step.querySelector<HTMLInputElement>('input[type="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
      email.classList.add('error');
      valid = false;
    }

    const arrival = step.querySelector<HTMLInputElement>('#arrival-date');
    const departure = step.querySelector<HTMLInputElement>('#departure-date');
    if (arrival?.value && departure?.value && departure.value <= arrival.value) {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isFormConfigured('inquiryId')) {
      showToast(
        'Online inquiries are temporarily unavailable. Please email prathibhatheekshana2021@gmail.com.',
        'error',
      );
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    const interestValues: Record<string, Interest> = {
      'Historical Sites': 'historical',
      Beaches: 'beaches',
      'Wildlife Safari': 'wildlife',
      'Nature & Hiking': 'nature',
      'Food & Cuisine': 'food',
      'Ayurveda & Wellness': 'wellness',
      Photography: 'photography',
      'Water Sports': 'water-sports',
      'Scenic Train Rides': 'train',
      'Culture & Traditions': 'culture',
    };
    const selectedInterests = Array.from(
      document.querySelectorAll<HTMLElement>('.interest-tag.selected'),
    )
      .map((el) => interestValues[(el.textContent || '').trim()])
      .filter((value): value is Interest => Boolean(value));
    const accommodationValues: Record<string, Accommodation> = {
      Budget: 'budget',
      'Mid-Range': 'standard',
      Luxury: 'luxury',
    };
    const selectedAccomElement = document.querySelector<HTMLElement>(
      '.accommodation-option.selected .accommodation-option__label',
    );
    const selectedAccom = accommodationValues[(selectedAccomElement?.textContent || '').trim()];

    const payload: Partial<InquiryPayload> = {
      fullName: (form.querySelector('#full-name') as HTMLInputElement)?.value.trim() || '',
      email: (form.querySelector('#email') as HTMLInputElement)?.value.trim() || '',
      nationality: ((form.querySelector('#nationality') as HTMLSelectElement)?.value === 'other'
        ? 'OTHER'
        : (form.querySelector('#nationality') as HTMLSelectElement)?.value) as IsoCountryCode,
      phone: (form.querySelector('#phone') as HTMLInputElement)?.value.trim() || '',
      arrivalDate: (form.querySelector('#arrival-date') as HTMLInputElement)?.value || '',
      departureDate: (form.querySelector('#departure-date') as HTMLInputElement)?.value || '',
      travelers: parseInt((form.querySelector('#travelers') as HTMLInputElement)?.value || '0', 10),
      interests: selectedInterests,
      termsConsent: (form.querySelector('#terms-consent') as HTMLInputElement)?.checked || false,
    };

    if (selectedAccom) {
      payload.accommodation = selectedAccom;
    }

    const specialReq = (
      form.querySelector('#special-requirements') as HTMLTextAreaElement
    )?.value.trim();
    if (specialReq) {
      payload.specialRequirements = specialReq;
    }

    const _gotcha = (form.querySelector('input[name="_gotcha"]') as HTMLInputElement)?.value || '';

    const payloadWithGotcha = { ...payload, _gotcha };

    const errors = validateInquiry(payload);
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

    if (errors.length > 0) {
      showToast(errors[0]?.message || 'Validation error', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);

    const result = await submitToFormspree(
      FORMS_CONFIG.inquiryId!,
      payloadWithGotcha,
      abortController,
    );
    clearTimeout(timeout);

    if (result.success) {
      showToast(result.message, 'success');

      const waMessage = `*New Inquiry via Website*%0A` +
        `*Name:* ${payload.fullName}%0A` +
        `*Email:* ${payload.email}%0A` +
        `*Nationality:* ${payload.nationality}%0A` +
        `*Phone:* ${payload.phone}%0A` +
        `*Dates:* ${payload.arrivalDate} to ${payload.departureDate}%0A` +
        `*Travelers:* ${payload.travelers}%0A` +
        (payload.accommodation ? `*Accommodation:* ${payload.accommodation}%0A` : '') +
        (payload.interests && payload.interests.length > 0 ? `*Interests:* ${payload.interests.join(', ')}%0A` : '') +
        (payload.specialRequirements ? `*Special Req:* ${payload.specialRequirements}%0A` : '');

      const waBtn = document.getElementById('whatsapp-success-btn') as HTMLAnchorElement;
      if (waBtn) waBtn.href = `https://wa.me/94773328848?text=${waMessage}`;

      showStep(steps.length - 1);
    } else {
      showToast(result.message, 'error');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
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
