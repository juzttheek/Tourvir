import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitToFormspree } from '../../src/services/forms-client.js';

describe('Formspree Adapter Contract', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles 200 OK responses with success and provider reference', async () => {
    const mockResponse = { ok: true, json: async () => ({ id: 'fsp_123' }) };
    vi.mocked(fetch).mockResolvedValue(mockResponse);

    const result = await submitToFormspree('test_form_id', { email: 'test@example.com' });

    expect(fetch).toHaveBeenCalledWith('https://formspree.io/f/test_form_id', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
      signal: null,
    });

    expect(result.success).toBe(true);
    expect(result.reference).toBe('fsp_123');
  });

  it('handles 400 Bad Request with validation errors', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      json: async () => ({
        errors: [{ field: 'email', message: 'is not a valid email' }],
      }),
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse);

    const result = await submitToFormspree('test_form_id', { email: 'invalid' });

    expect(result.success).toBe(false);
    expect(result.errors?.email).toBe('is not a valid email');
  });

  it('handles 429 Bot / Rate Limit rejection', async () => {
    const mockResponse = { ok: false, status: 429 };
    vi.mocked(fetch).mockResolvedValue(mockResponse);

    const result = await submitToFormspree('test_form_id', { email: 'spam@bot.com' });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Too many submissions');
  });

  it('handles 500 Server Errors gracefully', async () => {
    const mockResponse = { ok: false, status: 500 };
    vi.mocked(fetch).mockResolvedValue(mockResponse);

    const result = await submitToFormspree('test_form_id', { email: 'test@example.com' });

    expect(result.success).toBe(false);
    expect(result.message).toContain('unavailable');
  });

  it('handles offline/network errors gracefully preserving input (via honest fallback)', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Failed to fetch'));

    const result = await submitToFormspree('test_form_id', { email: 'test@example.com' });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Network error');
  });

  it('handles AbortController timeouts', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';
    vi.mocked(fetch).mockRejectedValue(abortError);

    const controller = new AbortController();
    const result = await submitToFormspree(
      'test_form_id',
      { email: 'test@example.com' },
      controller,
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('timed out');
  });
});
