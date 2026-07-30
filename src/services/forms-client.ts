/**
 * Formspree Client Service
 */

export interface SubmissionResponse {
  success: boolean;
  message: string;
  reference?: string;
  errors?: Record<string, string>;
}

/**
 * Submits form data to a Formspree endpoint.
 * @param formId The public Formspree form ID
 * @param payload The validated form data object
 * @param controller An AbortController to handle timeouts
 */
export async function submitToFormspree(
  formId: string,
  payload: Record<string, any>,
  controller?: AbortController,
): Promise<SubmissionResponse> {
  const url = `https://formspree.io/f/${formId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller?.signal || null,
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: true,
        message: 'Your submission was received successfully.',
        reference: data.id || undefined,
      };
    }

    if (response.status === 400) {
      const data = await response.json().catch(() => ({}));
      const errorMap: Record<string, string> = {};
      if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((err: any) => {
          if (err.field) {
            errorMap[err.field] = err.message;
          }
        });
      }
      return {
        success: false,
        message: 'There was a validation error with your submission. Please check your inputs.',
        errors: errorMap,
      };
    }

    if (response.status === 429) {
      return {
        success: false,
        message: 'Too many submissions. Please try again later or contact us directly.',
      };
    }

    // 500 or other errors
    return {
      success: false,
      message:
        'The form service is currently unavailable. Please try again later or contact us directly at sssrajapakshe@gmail.com.',
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'The submission timed out. Please check your network connection and try again.',
      };
    }

    // Network / Offline error
    return {
      success: false,
      message:
        'Network error. Please check your connection or contact us directly at sssrajapakshe@gmail.com.',
    };
  }
}
