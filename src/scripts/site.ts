import { initMain } from './main.js';
import { initGallery } from './gallery.js';
import { initPackages } from './packages.js';
import { initFormHandlers } from './forms.js';

function initSite(): void {
  initMain();
  initGallery();
  initPackages();
  initFormHandlers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}
