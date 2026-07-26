// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { initSidebar } from '../../src/scripts/navigation';

describe('Drawer Navigation Behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button class="hamburger" aria-expanded="false">Menu</button>
      <div class="sidebar-overlay"></div>
      <aside class="sidebar">
        <button class="sidebar__close">Close</button>
        <a href="#link1" class="sidebar__nav-link">Link 1</a>
        <a href="#link2" class="sidebar__nav-link">Link 2</a>
      </aside>
    `;
    document.body.style.overflow = '';
  });

  it('opens and closes sidebar on hamburger click', () => {
    initSidebar();
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    hamburger?.click();
    expect(sidebar?.classList.contains('active')).toBe(true);
    expect(overlay?.classList.contains('active')).toBe(true);
    expect(hamburger?.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');

    hamburger?.click();
    expect(sidebar?.classList.contains('active')).toBe(false);
    expect(hamburger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflow).toBe('');
  });

  it('closes sidebar on Escape key', () => {
    initSidebar();
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    hamburger?.click();
    expect(sidebar?.classList.contains('active')).toBe(true);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escEvent);
    expect(sidebar?.classList.contains('active')).toBe(false);
  });

  it('closes sidebar on overlay click', () => {
    initSidebar();
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    hamburger?.click();
    expect(sidebar?.classList.contains('active')).toBe(true);

    overlay?.click();
    expect(sidebar?.classList.contains('active')).toBe(false);
  });

  it('traps focus and restores it to the opener', () => {
    initSidebar();
    const hamburger = document.querySelector('.hamburger');
    const close = document.querySelector('.sidebar__close');
    const last = document.querySelectorAll('.sidebar__nav-link')[1];
    hamburger.focus();
    hamburger.click();
    expect(document.activeElement).toBe(close);

    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(close);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.activeElement).toBe(hamburger);
  });
});
