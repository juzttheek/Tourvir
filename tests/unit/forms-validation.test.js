// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import {
  isValidEmail,
  initContactForm,
  initFeedbackForm,
  serializeApprovedForm,
} from '../../src/scripts/forms';

describe('Form Validation Utilities', () => {
  it('validates email formats correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });

  it('serializes only approved fields and trims values', () => {
    document.body.innerHTML = '<form id="contact-form"></form>';
    const form = document.getElementById('contact-form');
    form.insertAdjacentHTML(
      'beforeend',
      '<input id="contact-name" value="  Jane  "><input id="contact-email" value="jane@example.com"><input id="unexpected" value="secret">',
    );
    expect(serializeApprovedForm(form, 'contact')).toEqual({
      'contact-name': 'Jane',
      'contact-email': 'jane@example.com',
    });
  });
});

describe('Contact & Feedback Forms', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form">
        <input type="text" id="name" required />
        <input type="email" id="email" required />
        <button type="submit">Submit</button>
      </form>
      <form id="feedback-form">
        <div id="feedback-stars">
          <span class="feedback-form__star" data-rating="1">★</span>
          <span class="feedback-form__star" data-rating="2">★</span>
        </div>
        <input type="hidden" id="feedback-rating" value="0" />
        <button type="submit">Submit</button>
      </form>
    `;
  });

  it('marks required fields as error when empty on submission', () => {
    initContactForm();
    const form = document.getElementById('contact-form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    const name = document.getElementById('name');
    expect(name.classList.contains('error')).toBe(true);
  });

  it('validates email field on submission', () => {
    initContactForm();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    name.value = 'John Doe';
    email.value = 'invalid-email';

    const form = document.getElementById('contact-form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(email.classList.contains('error')).toBe(true);
  });

  it('handles feedback form star rating and submission', () => {
    initFeedbackForm();
    const star2 = document.querySelector('.feedback-form__star[data-rating="2"]');
    star2.click();
    const ratingInput = document.getElementById('feedback-rating');
    expect(ratingInput.value).toBe('2');
  });
});
