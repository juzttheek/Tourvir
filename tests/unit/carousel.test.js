// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { CarouselController, initHeroSlider } from '../../src/scripts/carousel';

describe('Carousel Controller & Autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `<div id="carousel-test"></div>`;
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers onNext callback on interval', () => {
    const el = document.getElementById('carousel-test');
    const onNext = vi.fn();
    const controller = new CarouselController(el, onNext, 1000);
    controller.start();

    vi.advanceTimersByTime(2500);
    expect(onNext).toHaveBeenCalledTimes(2);

    controller.stop();
  });

  it('pauses autoplay when prefers-reduced-motion is reduce', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const el = document.getElementById('carousel-test');
    const onNext = vi.fn();
    const controller = new CarouselController(el, onNext, 1000);
    controller.start();

    vi.advanceTimersByTime(2500);
    expect(onNext).not.toHaveBeenCalled();

    controller.stop();
  });

  it('pauses autoplay on mouseenter and resumes on mouseleave', () => {
    const el = document.getElementById('carousel-test');
    const onNext = vi.fn();
    const controller = new CarouselController(el, onNext, 1000);
    controller.start();

    el.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(2000);
    expect(onNext).not.toHaveBeenCalled();

    el.dispatchEvent(new Event('mouseleave'));
    vi.advanceTimersByTime(1500);
    expect(onNext).toHaveBeenCalledTimes(1);

    controller.stop();
  });

  it('pauses while the document is hidden and cleans up listeners on stop', () => {
    const el = document.getElementById('carousel-test');
    const onNext = vi.fn();
    const removeElementListener = vi.spyOn(el, 'removeEventListener');
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener');
    const controller = new CarouselController(el, onNext, 1000);
    controller.start();

    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(1500);
    expect(onNext).not.toHaveBeenCalled();

    controller.stop();
    expect(removeElementListener).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeDocumentListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });

  it('loads hero slides progressively from inert templates', () => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    const idleCallbacks = [];
    window.requestIdleCallback = vi.fn((callback) => {
      idleCallbacks.push(callback);
      return idleCallbacks.length;
    });
    document.body.innerHTML = `
      <div id="hero-slider">
        <img class="active" src="first.webp" alt="First">
        <template data-hero-slide><img src="second.webp" alt="Second" loading="lazy"></template>
        <template data-hero-slide><img src="third.webp" alt="Third" loading="lazy"></template>
      </div>
      <button id="hero-pause-btn"></button>
    `;

    const controller = initHeroSlider();
    const slider = document.getElementById('hero-slider');
    expect(slider.querySelectorAll(':scope > img')).toHaveLength(1);

    idleCallbacks.shift()();
    expect(slider.querySelectorAll(':scope > img')).toHaveLength(2);

    vi.advanceTimersByTime(6000);
    expect(slider.querySelector('img[src="second.webp"]')?.classList.contains('active')).toBe(true);
    idleCallbacks.shift()();
    expect(slider.querySelectorAll(':scope > img')).toHaveLength(3);

    controller.stop();
  });
});
