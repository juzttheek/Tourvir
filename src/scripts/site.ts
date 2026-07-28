import { initMain } from './main.js';
import { initGallery } from './gallery.js';
import { initPackages } from './packages.js';
import { initFormHandlers } from './forms.js';
import { initTopBarWidgets } from './widgets.js';

function initSite(): void {
  initMain();
  initGallery();
  initPackages();
  initFormHandlers();
  initTopBarWidgets();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}
