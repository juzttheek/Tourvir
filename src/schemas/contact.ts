/**
 * Contact Form Schema Validation
 * Validates payload for Formspree submission.
 */

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: 'general' | 'booking' | 'package' | 'vehicle' | 'feedback' | 'partnership' | 'other';
  message: string;
  privacyConsent: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateContact(payload: Partial<ContactPayload>): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  } else if (payload.name.length > 100) {
    errors.push({ field: 'name', message: 'Name cannot exceed 100 characters.' });
  }

  if (!payload.email || !emailRegex.test(payload.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (payload.phone && payload.phone.length > 20) {
    errors.push({ field: 'phone', message: 'Phone number cannot exceed 20 characters.' });
  }

  const subjects = ['general', 'booking', 'package', 'vehicle', 'feedback', 'partnership', 'other'];
  if (!payload.subject || !subjects.includes(payload.subject)) {
    errors.push({ field: 'subject', message: 'Please select a valid subject.' });
  }

  if (!payload.message || payload.message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Message is required.' });
  } else if (payload.message.length > 1000) {
    errors.push({ field: 'message', message: 'Message cannot exceed 1000 characters.' });
  }

  if (!payload.privacyConsent) {
    errors.push({ field: 'privacyConsent', message: 'You must consent to the privacy policy.' });
  }

  return errors;
}
