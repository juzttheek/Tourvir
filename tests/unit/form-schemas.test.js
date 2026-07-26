import { describe, it, expect } from 'vitest';
import { validateContact } from '../../src/schemas/contact.js';
import { validateFeedback } from '../../src/schemas/feedback.js';
import { validateInquiry } from '../../src/schemas/inquiry.js';

describe('Form Schemas Validation', () => {
  describe('Contact Schema', () => {
    it('validates a correct payload', () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        subject: 'general',
        message: 'Hello, I have a question.',
        privacyConsent: true,
      };
      const errors = validateContact(payload);
      expect(errors).toHaveLength(0);
    });

    it('rejects oversized names and missing consent', () => {
      const payload = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        subject: 'general',
        message: 'Hello',
        privacyConsent: false,
      };
      const errors = validateContact(payload);
      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.field)).toContain('name');
      expect(errors.map((e) => e.field)).toContain('privacyConsent');
    });

    it('rejects oversized messages', () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'general',
        message: 'A'.repeat(1001),
        privacyConsent: true,
      };
      const errors = validateContact(payload);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('message');
    });
  });

  describe('Feedback Schema', () => {
    it('validates a correct payload', () => {
      const payload = {
        name: 'Jane Doe',
        tour: 'cultural-triangle',
        rating: 5,
        comments: 'Excellent trip!',
        testimonialConsent: true,
      };
      const errors = validateFeedback(payload);
      expect(errors).toHaveLength(0);
    });

    it('rejects out of bounds ratings', () => {
      const payload = {
        name: 'Jane Doe',
        tour: 'cultural-triangle',
        rating: 6,
        comments: 'Good',
        testimonialConsent: true,
      };
      const errors = validateFeedback(payload);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('rating');
    });
  });

  describe('Inquiry Schema', () => {
    it('validates a correct payload', () => {
      const payload = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        nationality: 'GB',
        arrivalDate: '2026-10-01',
        departureDate: '2026-10-10',
        travelers: 2,
        interests: ['culture', 'wildlife'],
        accommodation: 'luxury',
        termsConsent: true,
      };
      // @ts-ignore (testing dynamic JS validation)
      const errors = validateInquiry(payload);
      expect(errors).toHaveLength(0);
    });

    it('rejects invalid country codes and missing consent', () => {
      const payload = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        nationality: 'INVALID_COUNTRY',
        arrivalDate: '2026-10-01',
        departureDate: '2026-10-10',
        travelers: 2,
        interests: ['culture'],
        accommodation: 'luxury',
        termsConsent: false,
      };
      // @ts-ignore
      const errors = validateInquiry(payload);
      expect(errors.map((e) => e.field)).toContain('nationality');
      expect(errors.map((e) => e.field)).toContain('termsConsent');
    });

    it('rejects departure date before arrival date', () => {
      const payload = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        nationality: 'GB',
        arrivalDate: '2026-10-15',
        departureDate: '2026-10-10', // Departure before arrival
        travelers: 2,
        interests: ['culture'],
        accommodation: 'luxury',
        termsConsent: true,
      };
      // @ts-ignore
      const errors = validateInquiry(payload);
      expect(errors.map((e) => e.field)).toContain('departureDate');
    });

    it('rejects invalid enumerations for interests and accommodations', () => {
      const payload = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        nationality: 'GB',
        arrivalDate: '2026-10-01',
        departureDate: '2026-10-10',
        travelers: 2,
        interests: ['space-travel'], // Invalid
        accommodation: 'tent', // Invalid
        termsConsent: true,
      };
      // @ts-ignore
      const errors = validateInquiry(payload);
      expect(errors.map((e) => e.field)).toContain('interests');
      expect(errors.map((e) => e.field)).toContain('accommodation');
    });

    it('rejects more than 50 travelers', () => {
      const payload = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        nationality: 'GB',
        arrivalDate: '2026-10-01',
        departureDate: '2026-10-10',
        travelers: 51,
        interests: ['culture'],
        accommodation: 'luxury',
        termsConsent: true,
      };
      // @ts-ignore
      const errors = validateInquiry(payload);
      expect(errors.map((e) => e.field)).toContain('travelers');
    });
  });
});
