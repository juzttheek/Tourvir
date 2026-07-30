// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { GalleryController } from '../../src/scripts/gallery-controller';

describe('Gallery Controller & Lightbox', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="gallery-hero">
        <button class="filter-pill active" data-filter="all">All</button>
        <button class="filter-pill" data-filter="nature">Nature</button>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item" data-category="nature" tabindex="0">
          <img src="img1.jpg" alt="Nature 1" />
          <div class="gallery-item__title">Forest</div>
          <div class="gallery-item__location">Ella</div>
        </div>
        <div class="gallery-item" data-category="beach" tabindex="0">
          <img src="img2.jpg" alt="Beach 1" />
          <div class="gallery-item__title">Mirissa Beach</div>
          <div class="gallery-item__location">Mirissa</div>
        </div>
      </div>
      <div class="lightbox" aria-hidden="true">
        <button class="lightbox__close" aria-label="Close"></button>
        <button class="lightbox__prev" aria-label="Previous"></button>
        <button class="lightbox__next" aria-label="Next"></button>
        <img class="lightbox__image" src="" alt="" />
        <div class="lightbox__caption">
          <h4></h4>
          <p></p>
        </div>
      </div>
    `;
  });

  it('filters gallery items by category', async () => {
    const controller = new GalleryController();
    await controller.init();
    controller.filterCategory('nature');
    expect(controller.getVisibleItems()).toHaveLength(1);
  });

  it('opens lightbox and updates image caption safely', async () => {
    const controller = new GalleryController();
    await controller.init();
    controller.openLightbox(0);

    const lightbox = document.querySelector('.lightbox');
    expect(lightbox?.classList.contains('is-active')).toBe(true);

    const img = document.querySelector('.lightbox__image');
    expect(img?.getAttribute('src')).toContain('img1.jpg');

    const caption = document.querySelector('.lightbox__caption h4');
    expect(caption?.textContent).toBe('Forest');
  });

  it('navigates next and previous images', async () => {
    const controller = new GalleryController();
    await controller.init();
    controller.openLightbox(0);

    controller.nextImage();
    const img = document.querySelector('.lightbox__image');
    expect(img?.getAttribute('src')).toContain('img2.jpg');

    controller.prevImage();
    expect(img?.getAttribute('src')).toContain('img1.jpg');
  });

  it('closes lightbox on Escape key', async () => {
    const controller = new GalleryController();
    await controller.init();
    controller.openLightbox(0);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escEvent);

    const lightbox = document.querySelector('.lightbox');
    expect(lightbox?.classList.contains('is-active')).toBe(false);
  });

  it('traps focus and restores focus after closing', async () => {
    const controller = new GalleryController();
    await controller.init();
    const opener = document.querySelector('.gallery-item');
    const close = document.querySelector('.lightbox__close');
    const next = document.querySelector('.lightbox__next');
    opener.focus();
    controller.openLightbox(0);
    expect(document.activeElement).toBe(close);

    next.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(close);
    controller.closeLightbox();
    expect(document.activeElement).toBe(opener);
  });

  it('navigates with a touch swipe', async () => {
    const controller = new GalleryController();
    await controller.init();
    controller.openLightbox(0);
    const lightbox = document.querySelector('.lightbox');
    const start = new Event('touchstart');
    Object.defineProperty(start, 'changedTouches', { value: [{ screenX: 100 }] });
    lightbox.dispatchEvent(start);
    const end = new Event('touchend');
    Object.defineProperty(end, 'changedTouches', { value: [{ screenX: 20 }] });
    lightbox.dispatchEvent(end);
    expect(document.querySelector('.lightbox__image').getAttribute('src')).toContain('img2.jpg');
  });
});
