/* ============================================
   Tourvir — Toast Status Announcements
   ============================================ */

export type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info'): HTMLElement {
  let container = document.querySelector('.toast-container') as HTMLElement | null;
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('role', 'status');
    document.body.appendChild(container);
  }

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast__icon';
  iconSpan.textContent = icons[type] || icons.info;

  const msgSpan = document.createElement('span');
  msgSpan.className = 'toast__message';
  msgSpan.textContent = message;

  const closeSpan = document.createElement('span');
  closeSpan.className = 'toast__close';
  closeSpan.textContent = '✕';
  closeSpan.setAttribute('aria-label', 'Close notification');
  closeSpan.setAttribute('role', 'button');
  closeSpan.setAttribute('tabindex', '0');

  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  };

  closeSpan.addEventListener('click', removeToast);
  closeSpan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      removeToast();
    }
  });

  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);
  toast.appendChild(closeSpan);

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(removeToast, 4000);

  return toast;
}
