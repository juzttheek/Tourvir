/* ============================================
   Tourvir — Gallery Filtering & Lightbox Controller
   ============================================ */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class GalleryController {
  private pills: NodeListOf<HTMLElement>;
  private items: NodeListOf<HTMLElement>;
  private lightbox: HTMLElement | null;
  private lightboxImg: HTMLImageElement | null;
  private lightboxCaption: HTMLElement | null;
  private lightboxDesc: HTMLElement | null;
  private closeBtn: HTMLElement | null;
  private prevBtn: HTMLElement | null;
  private nextBtn: HTMLElement | null;

  private activeFilter = 'all';
  private currentIndex = 0;
  private previousActiveElement: HTMLElement | null = null;
  private touchStartX = 0;
  private touchEndX = 0;

  constructor() {
    this.pills = document.querySelectorAll(
      '.gallery-section .filter-pill, .gallery-hero .filter-pill, .filter-pill',
    );
    this.items = document.querySelectorAll('.gallery-item');
    this.lightbox = document.querySelector('.lightbox');
    this.lightboxImg = this.lightbox?.querySelector('.lightbox__image') as HTMLImageElement | null;
    this.lightboxCaption = this.lightbox?.querySelector(
      '.lightbox__caption h4',
    ) as HTMLElement | null;
    this.lightboxDesc = this.lightbox?.querySelector('.lightbox__caption p') as HTMLElement | null;
    this.closeBtn = this.lightbox?.querySelector('.lightbox__close') as HTMLElement | null;
    this.prevBtn = this.lightbox?.querySelector('.lightbox__prev') as HTMLElement | null;
    this.nextBtn = this.lightbox?.querySelector('.lightbox__next') as HTMLElement | null;
  }

  public init(): void {
    if (!this.items.length) return;
    const root = document.querySelector<HTMLElement>('.gallery-section, .gallery-grid');
    if (root?.dataset.galleryInitialized === 'true') return;
    if (root) root.dataset.galleryInitialized = 'true';

    this.initFilter();
    if (this.lightbox) {
      this.initLightbox();
    }
  }

  public filterCategory(filter: string): void {
    this.activeFilter = filter;
    this.pills.forEach((p) => p.classList.toggle('active', p.dataset.filter === filter));

    Array.from(this.items).forEach((item, index) => {
      const category = item.dataset.category || '';
      const show = filter === 'all' || category === filter;

      if (show) {
        item.style.display = '';
        item.style.animation = `fadeInGallery 0.4s ease ${index * 0.05}s both`;
      } else {
        item.style.display = 'none';
      }
    });
  }

  private initFilter(): void {
    this.pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const filter = pill.dataset.filter || 'all';
        this.filterCategory(filter);
      });
    });
  }

  public getVisibleItems(): HTMLElement[] {
    return Array.from(this.items).filter((item) => item.style.display !== 'none');
  }

  public openLightbox(visibleIndex: number): void {
    const visibleItems = this.getVisibleItems();
    if (!visibleItems.length || visibleIndex < 0 || visibleIndex >= visibleItems.length) return;

    this.previousActiveElement = document.activeElement as HTMLElement | null;
    this.currentIndex = visibleIndex;
    this.updateLightboxImage();

    if (this.lightbox) {
      this.lightbox.classList.add('active');
      this.lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const focusables = this.lightbox.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0 && focusables[0]) {
        focusables[0].focus();
      }
    }
  }

  public closeLightbox(): void {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('active');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }

  public updateLightboxImage(): void {
    const visibleItems = this.getVisibleItems();
    const item = visibleItems[this.currentIndex];
    if (!item || !this.lightboxImg) return;

    const img = item.querySelector('img') as HTMLImageElement | null;
    const title = item.querySelector('.gallery-item__title') as HTMLElement | null;
    const location = item.querySelector('.gallery-item__location') as HTMLElement | null;

    if (img) {
      this.lightboxImg.src = img.src;
      this.lightboxImg.alt = img.alt || '';
    }

    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = title ? title.textContent : '';
    }

    if (this.lightboxDesc) {
      this.lightboxDesc.textContent = location ? location.textContent : '';
    }
  }

  public nextImage(): void {
    const visibleItems = this.getVisibleItems();
    if (!visibleItems.length) return;
    this.currentIndex = (this.currentIndex + 1) % visibleItems.length;
    this.updateLightboxImage();
  }

  public prevImage(): void {
    const visibleItems = this.getVisibleItems();
    if (!visibleItems.length) return;
    this.currentIndex = (this.currentIndex - 1 + visibleItems.length) % visibleItems.length;
    this.updateLightboxImage();
  }

  private initLightbox(): void {
    Array.from(this.items).forEach((item) => {
      const openItem = () => {
        const visibleIndex = this.getVisibleItems().indexOf(item);
        if (visibleIndex >= 0) this.openLightbox(visibleIndex);
      };

      item.addEventListener('click', openItem);
      item.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openItem();
        }
      });
    });

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeLightbox());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevImage());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextImage());

    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });

      // Swipe navigation
      this.lightbox.addEventListener(
        'touchstart',
        (e: TouchEvent) => {
          const touch = e.changedTouches[0];
          if (touch) this.touchStartX = touch.screenX;
        },
        { passive: true },
      );

      this.lightbox.addEventListener(
        'touchend',
        (e: TouchEvent) => {
          const touch = e.changedTouches[0];
          if (touch) {
            this.touchEndX = touch.screenX;
            this.handleSwipe();
          }
        },
        { passive: true },
      );
    }

    // Keyboard navigation & focus trap
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.lightbox?.classList.contains('active')) return;

      if (e.key === 'Escape') {
        this.closeLightbox();
        return;
      }
      if (e.key === 'ArrowRight') {
        this.nextImage();
        return;
      }
      if (e.key === 'ArrowLeft') {
        this.prevImage();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = Array.from(
          this.lightbox.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
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

  private handleSwipe(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
    }
  }
}

export function initGalleryController(): GalleryController {
  const controller = new GalleryController();
  controller.init();
  return controller;
}
