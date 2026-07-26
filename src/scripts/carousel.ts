/* ============================================
   Tourvir — Carousels & Hero Sliders Controller
   ============================================ */

export class CarouselController {
  private element: HTMLElement;
  private intervalMs: number;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private isPaused = false;
  private onNext: () => void;
  private visibilityHandler: () => void;
  private mouseEnterHandler = () => this.pause();
  private mouseLeaveHandler = () => this.resume();
  private focusInHandler = () => this.pause();
  private focusOutHandler = () => this.resume();

  constructor(element: HTMLElement, onNext: () => void, intervalMs = 5000) {
    this.element = element;
    this.onNext = onNext;
    this.intervalMs = intervalMs;

    this.visibilityHandler = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };
  }

  public start(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Do not autoplay if user prefers reduced motion
    }

    this.element.addEventListener('mouseenter', this.mouseEnterHandler);
    this.element.addEventListener('mouseleave', this.mouseLeaveHandler);
    this.element.addEventListener('focusin', this.focusInHandler);
    this.element.addEventListener('focusout', this.focusOutHandler);

    document.addEventListener('visibilitychange', this.visibilityHandler);

    this.resume();
  }

  public pause(): void {
    this.isPaused = true;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public resume(): void {
    this.isPaused = false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (this.timerId !== null) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      if (!this.isPaused && !document.hidden) {
        this.onNext();
      }
    }, this.intervalMs);
  }

  public stop(): void {
    this.pause();
    this.element.removeEventListener('mouseenter', this.mouseEnterHandler);
    this.element.removeEventListener('mouseleave', this.mouseLeaveHandler);
    this.element.removeEventListener('focusin', this.focusInHandler);
    this.element.removeEventListener('focusout', this.focusOutHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }
}

export function initHeroSlider(): CarouselController | null {
  const slider = document.getElementById('hero-slider') as HTMLElement | null;
  if (!slider) return null;

  const images = slider.querySelectorAll('img');
  if (images.length <= 1) return null;

  let currentIndex = 0;

  const controller = new CarouselController(
    slider,
    () => {
      const activeImg = images[currentIndex];
      if (activeImg) activeImg.classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      const nextImg = images[currentIndex];
      if (nextImg) nextImg.classList.add('active');
    },
    5000,
  );

  controller.start();
  return controller;
}

export function initTestimonialCarousel(): CarouselController | null {
  const track = document.querySelector('.testimonials__track') as HTMLElement | null;
  const dots = document.querySelectorAll<HTMLElement>('.testimonials__dot');

  if (!track || !dots.length) return null;

  let currentSlide = 0;
  const slideCount = dots.length;

  function goToSlide(index: number) {
    currentSlide = index;
    track!.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  const parent = (track.closest('.testimonials') as HTMLElement | null) || track;

  const controller = new CarouselController(
    parent,
    () => {
      goToSlide((currentSlide + 1) % slideCount);
    },
    5000,
  );

  controller.start();
  return controller;
}
