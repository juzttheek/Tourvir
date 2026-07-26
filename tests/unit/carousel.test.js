// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { CarouselController } from '../../src/scripts/carousel';

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
});
