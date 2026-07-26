/* ============================================
   Tourvir — Gallery Admin Panel
   Upload, manage & dynamically load images
   via Firebase Storage + Firestore
   ============================================ */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  // SHA-256 hash of the admin password.
  // Default password: "tourvir2026"
  // To change: update the hash below with the SHA-256 of the new password.
  const ADMIN_PASSWORD_HASH = 'bdca7afc8be533dd62a32809ac6dff314d3b46581773d7559bd7c91e83b419cd';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const COLLECTION_NAME = 'gallery_images';
  const STORAGE_PATH = 'gallery/';

  // ── Firebase refs ───────────────────────────────────────
  const storage = firebase.storage();
  const storageRef = storage.ref();

  // ── DOM refs ────────────────────────────────────────────
  const adminTrigger   = document.getElementById('admin-trigger');
  const adminPanel     = document.getElementById('admin-panel');
  const adminOverlay   = document.getElementById('admin-overlay');
  const adminClose     = document.getElementById('admin-close');
  const adminGate      = document.getElementById('admin-gate');
  const adminContent   = document.getElementById('admin-content');
  const passwordInput  = document.getElementById('admin-password');
  const loginBtn       = document.getElementById('admin-login-btn');
  const adminError     = document.getElementById('admin-error');

  const uploadZone     = document.getElementById('upload-zone');
  const fileInput      = document.getElementById('admin-file-input');
  const placeholder    = document.getElementById('upload-placeholder');
  const previewGrid    = document.getElementById('preview-grid');
  const uploadFields   = document.getElementById('upload-fields');
  const titleInput     = document.getElementById('img-title');
  const categorySelect = document.getElementById('img-category');
  const locationInput  = document.getElementById('img-location');
  const uploadBtn      = document.getElementById('admin-upload-btn');
  const uploadBtnText  = document.getElementById('upload-btn-text');
  const uploadSpinner  = document.getElementById('upload-spinner');
  const progressWrap   = document.getElementById('upload-progress');
  const progressBar    = document.getElementById('upload-progress-bar');
  const uploadedList   = document.getElementById('uploaded-list');

  const dynamicContainer = document.getElementById('gallery-dynamic-container');

  let selectedFiles = [];
  let isAdmin = false;

  // ── Utilities ───────────────────────────────────────────
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('active'));
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ── Open / Close Panel ──────────────────────────────────
  function openPanel() {
    adminPanel.classList.add('active');
    adminOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!isAdmin) {
      passwordInput.focus();
    }
  }

  function closePanel() {
    adminPanel.classList.remove('active');
    adminOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  adminTrigger.addEventListener('click', openPanel);
  adminClose.addEventListener('click', closePanel);
  adminOverlay.addEventListener('click', closePanel);

  // Close with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminPanel.classList.contains('active')) {
      closePanel();
    }
  });

  // ── Password Authentication ─────────────────────────────
  async function authenticate() {
    const password = passwordInput.value.trim();
    if (!password) {
      adminError.textContent = 'Please enter a password';
      return;
    }

    const hash = await sha256(password);
    if (hash === ADMIN_PASSWORD_HASH) {
      isAdmin = true;
      adminGate.style.display = 'none';
      adminContent.style.display = 'block';
      adminError.textContent = '';
      loadUploadedList();
      showToast('Welcome, Admin!');
      // Add admin class to body for gallery delete buttons
      document.body.classList.add('is-admin');
    } else {
      adminError.textContent = 'Incorrect password. Try again.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  loginBtn.addEventListener('click', authenticate);
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') authenticate();
  });

  // ── File Selection & Preview ────────────────────────────
  uploadZone.addEventListener('click', (e) => {
    if (e.target.closest('#preview-grid')) return;
    fileInput.click();
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    selectedFiles = [];
    previewGrid.innerHTML = '';

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image`, 'error');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        showToast(`${file.name} exceeds 10MB limit`, 'error');
        continue;
      }
      selectedFiles.push(file);
    }

    if (selectedFiles.length > 0) {
      placeholder.style.display = 'none';
      uploadFields.style.display = 'block';

      selectedFiles.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const item = document.createElement('div');
          item.className = 'admin-panel__preview-item';
          item.innerHTML = `
            <img src="${e.target.result}" alt="Preview ${i + 1}">
            <button class="admin-panel__preview-remove" data-index="${i}" title="Remove">&times;</button>
            <span class="admin-panel__preview-name">${file.name}</span>
          `;
          previewGrid.appendChild(item);
        };
        reader.readAsDataURL(file);
      });
    } else {
      placeholder.style.display = '';
      uploadFields.style.display = 'none';
    }
  }

  // Remove preview item
  previewGrid.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.admin-panel__preview-remove');
    if (!removeBtn) return;
    const index = parseInt(removeBtn.dataset.index);
    selectedFiles.splice(index, 1);
    // Re-render previews
    handleFilesFromArray(selectedFiles);
  });

  function handleFilesFromArray(files) {
    previewGrid.innerHTML = '';
    if (files.length === 0) {
      placeholder.style.display = '';
      uploadFields.style.display = 'none';
      return;
    }
    placeholder.style.display = 'none';
    uploadFields.style.display = 'block';
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const item = document.createElement('div');
        item.className = 'admin-panel__preview-item';
        item.innerHTML = `
          <img src="${e.target.result}" alt="Preview ${i + 1}">
          <button class="admin-panel__preview-remove" data-index="${i}" title="Remove">&times;</button>
          <span class="admin-panel__preview-name">${file.name}</span>
        `;
        previewGrid.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Upload to Firebase ──────────────────────────────────
  uploadBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) {
      showToast('No files selected', 'error');
      return;
    }

    const title = titleInput.value.trim() || 'Untitled';
    const category = categorySelect.value;
    const location = locationInput.value.trim() || '';

    uploadBtnText.style.display = 'none';
    uploadSpinner.style.display = '';
    uploadBtn.disabled = true;
    progressWrap.style.display = 'block';

    let uploadedCount = 0;
    const totalFiles = selectedFiles.length;

    for (const file of selectedFiles) {
      try {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const fileRef = storageRef.child(STORAGE_PATH + fileName);

        // Upload with progress
        const uploadTask = fileRef.put(file);

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Upload timed out. Is Firebase Storage enabled in your Firebase Console?"));
          }, 30000); // 30 second timeout

          uploadTask.on('state_changed',
            (snapshot) => {
              const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes);
              const totalProgress = ((uploadedCount + fileProgress) / totalFiles) * 100;
              progressBar.style.width = totalProgress + '%';
            },
            (error) => {
              clearTimeout(timeout);
              reject(error);
            },
            () => {
              clearTimeout(timeout);
              resolve();
            }
          );
        });

        // Get download URL
        const downloadURL = await fileRef.getDownloadURL();

        // Save metadata to Firestore
        await db.collection(COLLECTION_NAME).add({
          title: totalFiles > 1 ? `${title} (${uploadedCount + 1})` : title,
          category: category,
          location: location,
          url: downloadURL,
          storagePath: STORAGE_PATH + fileName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        uploadedCount++;
      } catch (error) {
        console.error('Upload error:', error);
        showToast(`Failed to upload: ${file.name}`, 'error');
      }
    }

    // Reset form
    uploadBtnText.style.display = '';
    uploadSpinner.style.display = 'none';
    uploadBtn.disabled = false;
    progressWrap.style.display = 'none';
    progressBar.style.width = '0%';
    selectedFiles = [];
    previewGrid.innerHTML = '';
    placeholder.style.display = '';
    uploadFields.style.display = 'none';
    titleInput.value = '';
    locationInput.value = '';
    fileInput.value = '';

    if (uploadedCount > 0) {
      showToast(`${uploadedCount} image(s) uploaded successfully!`);
      loadDynamicGallery();
      loadUploadedList();
    }
  });

  // ── Delete Image ────────────────────────────────────────
  async function deleteImage(docId, storagePath) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete from Storage
      if (storagePath) {
        await storage.ref(storagePath).delete();
      }
      // Delete from Firestore
      await db.collection(COLLECTION_NAME).doc(docId).delete();

      showToast('Image deleted successfully');
      loadDynamicGallery();
      loadUploadedList();
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete image', 'error');
    }
  }

  // ── Load Uploaded List (Admin Panel) ────────────────────
  async function loadUploadedList() {
    if (!uploadedList) return;

    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) {
        uploadedList.innerHTML = '<p class="admin-panel__empty">No uploaded images yet.</p>';
        return;
      }

      uploadedList.innerHTML = '';
      snapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement('div');
        item.className = 'admin-panel__uploaded-item';
        item.innerHTML = `
          <img src="${data.url}" alt="${data.title}" loading="lazy">
          <div class="admin-panel__uploaded-info">
            <strong>${data.title}</strong>
            <span>${data.category} · 📍 ${data.location || 'N/A'}</span>
          </div>
          <button class="admin-panel__delete-btn" title="Delete image">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        `;
        item.querySelector('.admin-panel__delete-btn').addEventListener('click', () => {
          deleteImage(doc.id, data.storagePath);
        });
        uploadedList.appendChild(item);
      });
    } catch (error) {
      console.error('Error loading uploaded list:', error);
      uploadedList.innerHTML = '<p class="admin-panel__empty">Failed to load images.</p>';
    }
  }

  // ── Load Dynamic Gallery (Public) ───────────────────────
  async function loadDynamicGallery() {
    if (!dynamicContainer) return;

    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .orderBy('createdAt', 'asc')
        .get();

      // Clear existing dynamic items
      dynamicContainer.innerHTML = '';

      if (snapshot.empty) return;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement('div');
        item.className = 'gallery-item gallery-item--dynamic reveal';
        item.dataset.category = data.category;
        item.dataset.docId = doc.id;
        item.innerHTML = `
          <img loading="lazy" src="${data.url}" alt="${data.title}">
          <div class="gallery-item__overlay">
            <div class="gallery-item__zoom">🔍</div>
            <h4 class="gallery-item__title">${data.title}</h4>
            <p class="gallery-item__location">📍 ${data.location || ''}</p>
          </div>
          <button class="gallery-item__admin-delete" title="Delete this image" data-doc-id="${doc.id}" data-storage-path="${data.storagePath || ''}">✕</button>
        `;
        dynamicContainer.appendChild(item);
      });

      // Re-init reveal animations for new items
      initDynamicReveal();

      // Re-init filter & lightbox to include new items
      reinitGalleryFeatures();

      // Add delete button listeners (only visible when admin)
      document.querySelectorAll('.gallery-item__admin-delete').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteImage(btn.dataset.docId, btn.dataset.storagePath);
        });
      });

    } catch (error) {
      console.error('Error loading dynamic gallery:', error);
    }
  }

  // ── Re-initialize gallery features for dynamic items ────
  function reinitGalleryFeatures() {
    // Re-attach filter functionality
    const pills = document.querySelectorAll('.filter-pill');
    const allItems = document.querySelectorAll('.gallery-item');

    pills.forEach(pill => {
      // Clone & replace to remove old listeners
      const newPill = pill.cloneNode(true);
      pill.parentNode.replaceChild(newPill, pill);

      newPill.addEventListener('click', () => {
        const filter = newPill.dataset.filter;
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        newPill.classList.add('active');

        document.querySelectorAll('.gallery-item').forEach((item, index) => {
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

    // Re-attach lightbox
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox__image');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption h4');
    const lightboxDesc = lightbox.querySelector('.lightbox__caption p');

    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      // Remove old click listener by cloning (only for dynamic items)
      if (item.classList.contains('gallery-item--dynamic')) {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.gallery-item__admin-delete')) return;
          const visibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
          const currentIndex = visibleItems.indexOf(item);

          const img = item.querySelector('img');
          const title = item.querySelector('.gallery-item__title');
          const location = item.querySelector('.gallery-item__location');

          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxCaption) lightboxCaption.textContent = title ? title.textContent : '';
          if (lightboxDesc) lightboxDesc.textContent = location ? location.textContent : '';

          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }
    });
  }

  // ── Reveal animation for dynamic items ──────────────────
  function initDynamicReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item--dynamic.reveal:not(.revealed)').forEach(el => {
      observer.observe(el);
    });
  }

  // ── Initialize on page load ─────────────────────────────
  loadDynamicGallery();

})();
