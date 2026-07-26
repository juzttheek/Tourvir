/**
 * Feedback Form Schema Validation
 */

import type { ValidationError } from './contact.js';

export interface FeedbackPayload {
  name: string;
  tour: string;
  rating: number;
  comments: string;
  email?: string;
  country?: string;
  testimonialConsent: boolean;
}

export function validateFeedback(payload: Partial<FeedbackPayload>): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.name || payload.name.trim().length < 2 || payload.name.length > 100) {
    errors.push({ field: 'name', message: 'Please enter a valid name.' });
  }

  const tours = [
    'cultural-triangle',
    'beach-paradise',
    'wildlife-safari',
    'hill-country',
    'complete-sri-lanka',
    'honeymoon',
    'other',
  ];
  if (!payload.tour || !tours.includes(payload.tour)) {
    errors.push({ field: 'tour', message: 'Please select a valid tour package.' });
  }

  if (
    payload.rating === undefined ||
    payload.rating < 1 ||
    payload.rating > 5 ||
    !Number.isInteger(payload.rating)
  ) {
    errors.push({
      field: 'rating',
      message: 'Please select a valid rating between 1 and 5 stars.',
    });
  }

  if (!payload.comments || payload.comments.trim().length === 0) {
    errors.push({ field: 'comments', message: 'Comments are required.' });
  } else if (payload.comments.length > 1000) {
    errors.push({ field: 'comments', message: 'Comments cannot exceed 1000 characters.' });
  }

  if (payload.email && payload.email.trim().length > 0 && !emailRegex.test(payload.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (payload.country && payload.country.length > 100) {
    errors.push({ field: 'country', message: 'Country name cannot exceed 100 characters.' });
  }

  if (!payload.testimonialConsent) {
    errors.push({
      field: 'testimonialConsent',
      message: 'You must consent to testimonial usage to submit.',
    });
  }

  return errors;
}
