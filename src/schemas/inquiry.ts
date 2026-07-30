/**
 * Inquiry Form Schema Validation
 */

import type { ValidationError } from './contact.js';

export const APPROVED_INTERESTS = [
  'historical',
  'beaches',
  'wildlife',
  'nature',
  'food',
  'wellness',
  'culture',
  'adventure',
  'relaxation',
  'photography',
  'water-sports',
  'train',
] as const;
export type Interest = (typeof APPROVED_INTERESTS)[number];

export const APPROVED_ACCOMMODATIONS = ['budget', 'standard', 'luxury'] as const;
export type Accommodation = (typeof APPROVED_ACCOMMODATIONS)[number];

export const APPROVED_TRAVELER_RANGES = ['1', '2', '3-4', '5-8', '9+'] as const;
export type TravelerRange = (typeof APPROVED_TRAVELER_RANGES)[number];

export const APPROVED_VEHICLES = ['sedan', 'suv', 'van', 'luxury', 'coach'] as const;
export type PreferredVehicle = (typeof APPROVED_VEHICLES)[number];

export const ISO_COUNTRY_CODES = [
  'US',
  'GB',
  'CA',
  'AU',
  'NZ',
  'IE',
  'ZA',
  'FR',
  'DE',
  'IT',
  'ES',
  'NL',
  'SE',
  'NO',
  'DK',
  'FI',
  'CH',
  'AT',
  'BE',
  'PT',
  'JP',
  'SG',
  'AE',
  'IN',
  'CN',
  'RU',
  'OTHER',
] as const;
export type IsoCountryCode = (typeof ISO_COUNTRY_CODES)[number];

export interface InquiryPayload {
  fullName: string;
  email: string;
  nationality: IsoCountryCode;
  phone?: string;
  arrivalDate: string;
  departureDate: string;
  travelers: number;
  travelerRange?: TravelerRange;
  interests: Interest[];
  accommodation: Accommodation;
  preferredVehicle?: PreferredVehicle;
  specialRequirements?: string;
  termsConsent: boolean;
}

export function validateInquiry(payload: Partial<InquiryPayload>): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters.' });
  } else if (payload.fullName.length > 100) {
    errors.push({ field: 'fullName', message: 'Full name cannot exceed 100 characters.' });
  }

  if (!payload.email || !emailRegex.test(payload.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!payload.nationality || !ISO_COUNTRY_CODES.includes(payload.nationality as any)) {
    errors.push({ field: 'nationality', message: 'Please select a valid nationality.' });
  }

  if (payload.phone && payload.phone.length > 20) {
    errors.push({ field: 'phone', message: 'Phone number cannot exceed 20 characters.' });
  }

  // Dates
  if (!payload.arrivalDate) {
    errors.push({ field: 'arrivalDate', message: 'Arrival date is required.' });
  }
  if (!payload.departureDate) {
    errors.push({ field: 'departureDate', message: 'Departure date is required.' });
  }

  if (payload.arrivalDate && payload.departureDate) {
    const arrival = new Date(payload.arrivalDate);
    const departure = new Date(payload.departureDate);
    if (isNaN(arrival.getTime())) {
      errors.push({ field: 'arrivalDate', message: 'Invalid arrival date.' });
    }
    if (isNaN(departure.getTime())) {
      errors.push({ field: 'departureDate', message: 'Invalid departure date.' });
    }
    if (!isNaN(arrival.getTime()) && !isNaN(departure.getTime()) && departure <= arrival) {
      errors.push({
        field: 'departureDate',
        message: 'Departure date must be after arrival date.',
      });
    }
  }

  if (
    payload.travelers === undefined ||
    payload.travelers < 1 ||
    payload.travelers > 50 ||
    !Number.isInteger(payload.travelers)
  ) {
    errors.push({ field: 'travelers', message: 'Number of travelers must be between 1 and 50.' });
  }

  if (
    payload.travelerRange &&
    !APPROVED_TRAVELER_RANGES.includes(payload.travelerRange as TravelerRange)
  ) {
    errors.push({ field: 'travelerRange', message: 'Please select a valid traveler range.' });
  }

  if (!payload.interests || !Array.isArray(payload.interests) || payload.interests.length === 0) {
    errors.push({ field: 'interests', message: 'Please select at least one interest.' });
  } else {
    for (const interest of payload.interests) {
      if (!APPROVED_INTERESTS.includes(interest as any)) {
        errors.push({ field: 'interests', message: 'Invalid interest selected.' });
        break;
      }
    }
  }

  if (!payload.accommodation || !APPROVED_ACCOMMODATIONS.includes(payload.accommodation as any)) {
    errors.push({
      field: 'accommodation',
      message: 'Please select a valid accommodation preference.',
    });
  }

  if (
    payload.preferredVehicle &&
    !APPROVED_VEHICLES.includes(payload.preferredVehicle as PreferredVehicle)
  ) {
    errors.push({
      field: 'preferredVehicle',
      message: 'Please select a valid vehicle preference.',
    });
  }

  if (payload.specialRequirements && payload.specialRequirements.length > 1000) {
    errors.push({
      field: 'specialRequirements',
      message: 'Special requirements cannot exceed 1000 characters.',
    });
  }

  if (!payload.termsConsent) {
    errors.push({
      field: 'termsConsent',
      message: 'You must agree to the terms and privacy policy.',
    });
  }

  return errors;
}
