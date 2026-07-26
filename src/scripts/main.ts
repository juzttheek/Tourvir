/* ============================================
   Tourvir — Main Global Behaviors Entry Point
   ============================================ */

import { initTheme } from './theme.js';
import { initSidebar } from './navigation.js';
import { initScrollCoordinator } from './scroll-coordinator.js';
import { initHeroSlider, initTestimonialCarousel } from './carousel.js';

export function initMain(): void {
  initTheme();
  initSidebar();
  initScrollCoordinator();
  initHeroSlider();
  initTestimonialCarousel();
}
