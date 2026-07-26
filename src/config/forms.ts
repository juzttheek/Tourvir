/**
 * Formspree Integration Configuration
 *
 * Strict Requirement: Missing environment variables must return null
 * to keep forms disabled and fail honestly. Do not use fake or default IDs.
 */

// Import Vite's import.meta.env for environment variables.
// Astro exposes variables prefixed with PUBLIC_ to the client bundle.

export interface FormConfig {
  contactId: string | null;
  inquiryId: string | null;
  feedbackId: string | null;
}

export const FORMS_CONFIG: FormConfig = {
  contactId: import.meta.env.PUBLIC_FORMSPREE_CONTACT_ID || null,
  inquiryId: import.meta.env.PUBLIC_FORMSPREE_INQUIRY_ID || null,
  feedbackId: import.meta.env.PUBLIC_FORMSPREE_FEEDBACK_ID || null,
};

/**
 * Validates if a specific form endpoint is properly configured.
 */
export function isFormConfigured(formType: keyof FormConfig): boolean {
  return typeof FORMS_CONFIG[formType] === 'string' && FORMS_CONFIG[formType]!.length > 0;
}
