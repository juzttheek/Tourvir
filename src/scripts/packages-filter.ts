/* ============================================
   Tourvir — Package Search & Filter Controller
   ============================================ */

export interface PackageFilterState {
  category: string;
  keyword: string;
  duration: string;
  price: string;
}

export function filterPackageCards(
  cards: NodeListOf<HTMLElement> | HTMLElement[],
  state: PackageFilterState,
): { visibleCount: number; totalCount: number } {
  let visibleCount = 0;
  const cardArray = Array.from(cards);

  cardArray.forEach((card, index) => {
    const category = card.dataset.category || '';
    const title = (card.querySelector('.package-card__title')?.textContent || '').toLowerCase();
    const cardDuration = parseInt(card.dataset.duration || '0', 10);
    const cardPrice = parseInt(card.dataset.price || '0', 10);

    let show = true;

    // Category filter
    if (state.category !== 'all' && category !== state.category) {
      show = false;
    }

    // Keyword search filter
    if (show && state.keyword && !title.includes(state.keyword.toLowerCase())) {
      show = false;
    }

    // Duration filter
    if (show && state.duration !== 'all') {
      if (state.duration === 'short' && cardDuration > 4) show = false;
      if (state.duration === 'medium' && (cardDuration < 5 || cardDuration > 7)) show = false;
      if (state.duration === 'long' && cardDuration < 8) show = false;
    }

    // Price filter
    if (show && state.price !== 'all') {
      if (state.price === 'budget' && cardPrice >= 500) show = false;
      if (state.price === 'mid' && (cardPrice < 500 || cardPrice > 1000)) show = false;
      if (state.price === 'luxury' && cardPrice <= 1000) show = false;
    }

    if (show) {
      card.style.display = '';
      card.style.animation = `fadeInPackage 0.4s ease ${visibleCount * 0.08}s both`;
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  return { visibleCount, totalCount: cardArray.length };
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function initPackagesFilter(): void {
  const pills = document.querySelectorAll<HTMLElement>(
    '.packages-section .filter-pill, .packages-hero .filter-pill',
  );
  const cards = document.querySelectorAll<HTMLElement>('.package-card');
  const searchInput = document.getElementById('package-search') as HTMLInputElement | null;
  const durationSelect = document.getElementById('package-duration') as HTMLSelectElement | null;
  const priceSelect = document.getElementById('package-price') as HTMLSelectElement | null;
  const categorySelect = document.getElementById('package-category') as HTMLSelectElement | null;
  const searchButton = document.getElementById('package-search-button') as HTMLElement | null;
  const clearButton = document.getElementById('clear-filters-btn') as HTMLElement | null;
  const featuredPackage = document.querySelector<HTMLElement>('.featured-package');
  const emptyState = document.getElementById('packages-empty-state');

  if (!cards.length) return;
  const root = document.querySelector<HTMLElement>('.packages-section, .packages-hero');
  if (root?.dataset.packageFilterInitialized === 'true') return;
  if (root) root.dataset.packageFilterInitialized = 'true';

  const state: PackageFilterState = {
    category: 'all',
    keyword: '',
    duration: 'all',
    price: 'all',
  };

  const statusRegion = document.querySelector(
    '[role="status"].filter-status',
  ) as HTMLElement | null;

  function update() {
    state.keyword = searchInput ? searchInput.value.trim() : '';
    state.duration = durationSelect ? durationSelect.value : 'all';
    state.price = priceSelect ? priceSelect.value : 'all';
    state.category = categorySelect ? categorySelect.value : state.category;

    const result = filterPackageCards(cards, state);

    const hasActiveFilters =
      Boolean(state.keyword) ||
      state.duration !== 'all' ||
      state.price !== 'all' ||
      state.category !== 'all';
    if (featuredPackage) featuredPackage.style.display = hasActiveFilters ? 'none' : '';

    if (statusRegion) {
      statusRegion.textContent = `Showing ${result.visibleCount} of ${result.totalCount} packages`;
    }

    if (emptyState) emptyState.style.display = result.visibleCount === 0 ? 'block' : 'none';

    pills.forEach((pill) => {
      const active = pill.dataset.filter === state.category;
      pill.classList.toggle('active', active);
      pill.setAttribute('aria-pressed', String(active));
    });
  }

  // Category pill listeners
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      state.category = pill.dataset.filter || 'all';
      if (categorySelect) categorySelect.value = state.category;
      update();
    });
  });

  // Debounced input search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(update, 200);
    });
  }

  if (durationSelect) durationSelect.addEventListener('change', update);
  if (priceSelect) priceSelect.addEventListener('change', update);
  if (categorySelect) categorySelect.addEventListener('change', update);
  if (searchButton) searchButton.addEventListener('click', update);

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (durationSelect) durationSelect.value = 'all';
      if (priceSelect) priceSelect.value = 'all';
      if (categorySelect) categorySelect.value = 'all';
      state.category = 'all';
      update();
      searchInput?.focus();
    });
  }

  update();
}
