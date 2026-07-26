// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { filterPackageCards } from '../../src/scripts/packages-filter';

describe('Package Filtering Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="package-card" data-category="cultural" data-duration="7" data-price="750">
        <h3 class="package-card__title">Cultural Wonders</h3>
      </div>
      <div class="package-card" data-category="beach" data-duration="4" data-price="400">
        <h3 class="package-card__title">Beach Getaway</h3>
      </div>
      <div class="package-card" data-category="wildlife" data-duration="10" data-price="1200">
        <h3 class="package-card__title">Wild Safari</h3>
      </div>
    `;
  });

  it('filters cards by category', () => {
    const cards = document.querySelectorAll('.package-card');
    const result = filterPackageCards(cards, {
      category: 'cultural',
      keyword: '',
      duration: 'all',
      price: 'all',
    });
    expect(result.visibleCount).toBe(1);
    expect(cards[0].style.display).toBe('');
    expect(cards[1].style.display).toBe('none');
  });

  it('filters cards by keyword search', () => {
    const cards = document.querySelectorAll('.package-card');
    const result = filterPackageCards(cards, {
      category: 'all',
      keyword: 'safari',
      duration: 'all',
      price: 'all',
    });
    expect(result.visibleCount).toBe(1);
    expect(cards[2].style.display).toBe('');
  });

  it('filters cards by price range', () => {
    const cards = document.querySelectorAll('.package-card');
    const result = filterPackageCards(cards, {
      category: 'all',
      keyword: '',
      duration: 'all',
      price: 'budget',
    });
    expect(result.visibleCount).toBe(1);
    expect(cards[1].style.display).toBe('');
  });

  it('returns 0 visible cards when no package matches criteria', () => {
    const cards = document.querySelectorAll('.package-card');
    const result = filterPackageCards(cards, {
      category: 'beach',
      keyword: 'safari',
      duration: 'all',
      price: 'all',
    });
    expect(result.visibleCount).toBe(0);
  });

  it('combines duration and price criteria', () => {
    const cards = document.querySelectorAll('.package-card');
    const result = filterPackageCards(cards, {
      category: 'all',
      keyword: '',
      duration: 'medium',
      price: 'mid',
    });
    expect(result.visibleCount).toBe(1);
    expect(cards[0].style.display).toBe('');
  });
});
