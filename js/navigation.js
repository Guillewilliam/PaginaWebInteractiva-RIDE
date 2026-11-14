/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   NAVIGATION.JS — Gestión de Navegación, Drawer y Modales
   ======================================================== */

export function initNavigation({ onOpenView, onOpenBartali, onOpenActivities }) {
  const navMap = document.getElementById('nav-map');
  const navActivities = document.getElementById('nav-activities');
  const navBartali = document.getElementById('nav-bartali');
  const navGallery = document.getElementById('nav-gallery');
  const navIes = document.getElementById('nav-ies');
  const btnHome = document.getElementById('btn-home');

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const headerRight = document.querySelector('.header-right');

  const slideDrawer = document.getElementById('slide-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');

  const galleryView = document.getElementById('gallery-view');
  const btnCloseGallery = document.getElementById('btn-close-gallery');

  const navBtns = [navMap, navActivities, navBartali, navGallery];

  function setActiveNavBtn(targetBtn) {
    navBtns.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (targetBtn) targetBtn.classList.add('active');
    // Cerrar menú móvil si está abierto
    if (headerRight) headerRight.classList.remove('open');
  }

  // Navegación al Mapa
  if (navMap) {
    navMap.addEventListener('click', () => {
      setActiveNavBtn(navMap);
      if (galleryView) galleryView.classList.add('hidden');
      if (slideDrawer) slideDrawer.classList.remove('open');
      if (onOpenView) onOpenView('map');
    });
  }

  // Click en Logo / Inicio
  if (btnHome) {
    btnHome.addEventListener('click', () => {
      if (navMap) navMap.click();
    });
  }

  // Abrir 12 Actividades
  if (navActivities) {
    navActivities.addEventListener('click', () => {
      setActiveNavBtn(navActivities);
      if (galleryView) galleryView.classList.add('hidden');
      if (slideDrawer) slideDrawer.classList.add('open');
      if (onOpenActivities) onOpenActivities();
    });
  }

  // Abrir Ciclotaller Bartali
  if (navBartali) {
    navBartali.addEventListener('click', () => {
      setActiveNavBtn(navBartali);
      if (galleryView) galleryView.classList.add('hidden');
      if (slideDrawer) slideDrawer.classList.add('open');
      if (onOpenBartali) onOpenBartali();
    });
  }

  // Abrir Álbum RIDE (Galería)
  if (navGallery) {
    navGallery.addEventListener('click', () => {
      setActiveNavBtn(navGallery);
      if (slideDrawer) slideDrawer.classList.remove('open');
      if (galleryView) galleryView.classList.remove('hidden');
      if (onOpenView) onOpenView('gallery');
    });
  }

  // Cerrar Galería
  if (btnCloseGallery) {
    btnCloseGallery.addEventListener('click', () => {
      if (navMap) navMap.click();
    });
  }

  // Cerrar Drawer
  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener('click', () => {
      if (slideDrawer) slideDrawer.classList.remove('open');
      if (navMap) setActiveNavBtn(navMap);
    });
  }

  // Menú móvil hamburguesa
  if (mobileMenuBtn && headerRight) {
    mobileMenuBtn.addEventListener('click', () => {
      headerRight.classList.toggle('open');
    });
  }

  // Modales genéricos
  initModals();
}

function initModals() {
  // Abrir modales con data-modal="id"
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.remove('hidden');
    });
  });

  // Cerrar modales con data-close-modal="id"
  document.querySelectorAll('[data-close-modal]').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modalId = closeBtn.getAttribute('data-close-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.add('hidden');
    });
  });

  // Cerrar haciendo clic en el backdrop
  document.querySelectorAll('.app-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add('hidden');
      }
    });
  });

  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.app-modal-backdrop:not(.hidden)').forEach(modal => {
        modal.classList.add('hidden');
      });
      const lightbox = document.getElementById('modal-lightbox');
      if (lightbox && !lightbox.classList.contains('hidden')) {
        lightbox.classList.add('hidden');
      }
    }
  });

  // Botón especial en modal IES para enfocar mapa
  const btnFocusIes = document.getElementById('btn-focus-ies-map');
  if (btnFocusIes) {
    btnFocusIes.addEventListener('click', () => {
      const modal = document.getElementById('modal-ies');
      if (modal) modal.classList.add('hidden');
      const navMap = document.getElementById('nav-map');
      if (navMap) navMap.click();
      const btnCenterIes = document.getElementById('btn-center-ies');
      if (btnCenterIes) btnCenterIes.click();
    });
  }

  // Pestañas internas del Modal de Memoria
  const memoTabs = document.querySelectorAll('[data-memo-tab]');
  memoTabs.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      memoTabs.forEach(btn => btn.classList.remove('active'));
      tabBtn.classList.add('active');

      const targetPaneId = tabBtn.getAttribute('data-memo-tab');
      document.querySelectorAll('.memo-tab-pane').forEach(pane => {
        pane.classList.add('hidden');
      });

      const activePane = document.getElementById(targetPaneId);
      if (activePane) activePane.classList.remove('hidden');
    });
  });
}

