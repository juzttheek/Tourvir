/* ============================================
   Tourvir — Packages Page JavaScript
   Filter & Search Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPackageFilter();
  initPackageSearch();
});

function initPackageFilter() {
  const pills = document.querySelectorAll('.packages-section .filter-pill');
  const cards = document.querySelectorAll('.package-card');
  
  if (!pills.length || !cards.length) return;
  
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter;
      
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      cards.forEach((card, index) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        
        if (show) {
          card.style.display = '';
          card.style.animation = `fadeInPackage 0.4s ease ${index * 0.08}s both`;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initPackageSearch() {
  const searchInput = document.getElementById('package-search');
  const durationSelect = document.getElementById('package-duration');
  const priceSelect = document.getElementById('package-price');
  const searchButton = document.getElementById('package-search-button');
  const cards = document.querySelectorAll('.package-card');
  
  function filterCards() {
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const duration = durationSelect ? durationSelect.value : 'all';
    const price = priceSelect ? priceSelect.value : 'all';
    
    cards.forEach(card => {
      const title = card.querySelector('.package-card__title').textContent.toLowerCase();
      const cardDuration = card.dataset.duration || '';
      const cardPrice = parseInt(card.dataset.price) || 0;
      
      let show = true;
      
      if (search && !title.includes(search)) show = false;
      
      if (duration !== 'all') {
        const days = parseInt(cardDuration);
        if (duration === 'short' && days > 4) show = false;
        if (duration === 'medium' && (days < 5 || days > 7)) show = false;
        if (duration === 'long' && days < 8) show = false;
      }
      
      if (price !== 'all') {
        if (price === 'budget' && cardPrice > 500) show = false;
        if (price === 'mid' && (cardPrice < 500 || cardPrice > 1000)) show = false;
        if (price === 'luxury' && cardPrice < 1000) show = false;
      }
      
      card.style.display = show ? '' : 'none';
    });
  }
  
  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (durationSelect) durationSelect.addEventListener('change', filterCards);
  if (priceSelect) priceSelect.addEventListener('change', filterCards);
  if (searchButton) searchButton.addEventListener('click', filterCards);
}

// Animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInPackage {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
