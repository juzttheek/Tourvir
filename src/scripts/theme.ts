/* ============================================
   Tourvir — Theme Management Module
   ============================================ */

export function getSavedTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('Tourvir-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Fail safely if localStorage is restricted
  }
  return 'light';
}

export function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('Tourvir-theme', theme);
  } catch {
    // Fail safely if localStorage is restricted
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
    );
    if (theme === 'dark') {
      themeToggle.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
    } else {
      themeToggle.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
    }
  }
}

export function initTheme(): void {
  const current = getSavedTheme();
  setTheme(current);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = active === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
}
