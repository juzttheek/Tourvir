/* ============================================
   Tourvir — Gallery JavaScript
   Lightbox & Masonry Filter
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* ---------- Gallery Filter ---------- */
function initGalleryFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const items = document.querySelectorAll('.gallery-item');
  
  if (!pills.length || !items.length) return;
  
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter;
      
      // Update active pill
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter items
      items.forEach((item, index) => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;
        
        if (show) {
          item.style.display = '';
          item.style.animation = `fadeInGallery 0.4s ease ${index * 0.05}s both`;
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  
  if (!lightbox || !galleryItems.length) return;
  
  const lightboxImg = lightbox.querySelector('.lightbox__image');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption h4');
  const lightboxDesc = lightbox.querySelector('.lightbox__caption p');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  
  let currentIndex = 0;
  let visibleItems = [];
  
  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }
  
  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function updateLightboxImage() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item__title');
    const location = item.querySelector('.gallery-item__location');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = title ? title.textContent : '';
    if (lightboxDesc) lightboxDesc.textContent = location ? location.textContent : '';
  }
  
  function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }
  
  // Event listeners
  galleryItems.forEach((item) => {
    const openItem = () => {
      const visibleIndex = getVisibleItems().indexOf(item);
      if (visibleIndex >= 0) openLightbox(visibleIndex);
    };

    item.addEventListener('click', openItem);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openItem();
      }
    });
  });
  
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  
  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

// CSS animation for filter
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInGallery {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(style);
