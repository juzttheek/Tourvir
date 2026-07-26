/* ============================================
   Tourvir — Navigation & Sidebar Drawer
   ============================================ */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initSidebar(): void {
  const sidebar = document.querySelector('.sidebar') as HTMLElement | null;
  const overlay = document.querySelector('.sidebar-overlay') as HTMLElement | null;
  const hamburger = document.querySelector('.hamburger') as HTMLElement | null;
  const closeBtn = document.querySelector('.sidebar__close') as HTMLElement | null;

  if (!sidebar || !hamburger) return;
  if (sidebar.dataset.drawerInitialized === 'true') return;
  sidebar.dataset.drawerInitialized = 'true';

  let previousActiveElement: HTMLElement | null = null;

  function setAriaExpanded(expanded: boolean) {
    if (hamburger) hamburger.setAttribute('aria-expanded', String(expanded));
    document.querySelectorAll('.hamburger, [data-sidebar-toggle]').forEach((el) => {
      el.setAttribute('aria-expanded', String(expanded));
    });
  }

  function openSidebar() {
    previousActiveElement = document.activeElement as HTMLElement | null;
    sidebar?.classList.add('active');
    overlay?.classList.add('active');
    hamburger?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setAriaExpanded(true);

    const focusables = sidebar?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusables && focusables.length > 0 && focusables[0]) {
      focusables[0].focus();
    }
  }

  function closeSidebar() {
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
    setAriaExpanded(false);

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    } else if (hamburger) {
      hamburger.focus();
    }
  }

  hamburger.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('.sidebar__nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!sidebar.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeSidebar();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(sidebar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}
