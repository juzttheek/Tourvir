// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { getSavedTheme, setTheme, initTheme } from '../../src/scripts/theme';

describe('Theme Behavior', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    document.body.innerHTML = '<button id="theme-toggle"></button>';
  });

  it('defaults to light theme when no saved preference exists', () => {
    expect(getSavedTheme()).toBe('light');
  });

  it('retrieves saved theme from localStorage', () => {
    localStorage.setItem('Tourvir-theme', 'dark');
    expect(getSavedTheme()).toBe('dark');
  });

  it('handles localStorage errors gracefully', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: Access is denied');
    });
    expect(getSavedTheme()).toBe('light');
    getItemSpy.mockRestore();
  });

  it('sets data-theme attribute and updates toggle button', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    const toggle = document.getElementById('theme-toggle');
    expect(toggle?.getAttribute('aria-label')).toBe('Switch to light theme');

    setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(toggle?.getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('toggles theme on click in initTheme', () => {
    initTheme();
    const toggle = document.getElementById('theme-toggle');
    toggle?.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    toggle?.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
