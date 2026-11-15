/**
 * Gestión de navegación simplificada como ES Module para Proyecto RIDE:
 * - Vista Principal: Las 12 actividades + Actividad 13 (Mapa)
 * - Vista Detalle: Actividad individual (1 a 12)
 * - Vista Cartográfica: Actividad 13 a pantalla completa
 */
import { RideActivities } from './activities.js';
import { initRideMap } from './map.js';

export const RideNavigation = (() => {
  const homeView = document.getElementById('home-view');
  const detailView = document.getElementById('activity-detail-view');
  const mapView = document.getElementById('map-view');
  const btnBackHome = document.getElementById('btn-back-home');

  let currentActivityIndex = 0;

  function hideAllViews() {
    homeView?.classList.add('hidden');
    detailView?.classList.add('hidden');
    mapView?.classList.add('hidden');
  }

  function showHome() {
    hideAllViews();
    homeView?.classList.remove('hidden');
    btnBackHome?.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#inicio');
  }

  function showActivity(index) {
    const total = RideActivities.getCount();
    if (index < 0 || index >= total) return;

    currentActivityIndex = index;
    hideAllViews();
    detailView?.classList.remove('hidden');
    btnBackHome?.classList.remove('hidden');

    RideActivities.renderDetail(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `#actividad-${index + 1}`);
  }

  function showMapActivity() {
    hideAllViews();
    mapView?.classList.remove('hidden');
    btnBackHome?.classList.remove('hidden');
    history.replaceState(null, '', '#actividad-13-mapa');

    // Inicializa el mapa justo cuando el contenedor #map-view ya es visible
    requestAnimationFrame(() => {
      const map = initRideMap();
      if (map) {
        setTimeout(() => map.invalidateSize(), 150);
      }
    });
  }

  function init() {
    document.getElementById('nav-home-logo')?.addEventListener('click', (e) => {
      e.preventDefault();
      showHome();
    });

    btnBackHome?.addEventListener('click', showHome);
    document.getElementById('btn-detail-back')?.addEventListener('click', showHome);
    document.getElementById('btn-map-back')?.addEventListener('click', showHome);
    document.getElementById('btn-quick-map')?.addEventListener('click', showMapActivity);

    document.getElementById('btn-prev-activity')?.addEventListener('click', () => {
      if (currentActivityIndex > 0) {
        showActivity(currentActivityIndex - 1);
      } else {
        showHome();
      }
    });

    document.getElementById('btn-next-activity')?.addEventListener('click', () => {
      const total = RideActivities.getCount();
      if (currentActivityIndex + 1 < total) {
        showActivity(currentActivityIndex + 1);
      } else {
        showMapActivity();
      }
    });

    const toggleBtn = document.getElementById('btn-toggle-controls');
    const layersBody = document.getElementById('map-layers-container');
    toggleBtn?.addEventListener('click', () => {
      const collapsed = layersBody.classList.toggle('hidden');
      toggleBtn.textContent = collapsed ? '+' : '−';
      toggleBtn.setAttribute('aria-expanded', String(!collapsed));
    });

    document.getElementById('btn-close-map-info')?.addEventListener('click', () => {
      document.getElementById('map-info-panel')?.classList.add('hidden');
    });

    const hash = window.location.hash;
    if (hash === '#actividad-13-mapa') {
      showMapActivity();
    } else if (hash.startsWith('#actividad-')) {
      const num = parseInt(hash.replace('#actividad-', ''), 10);
      if (!isNaN(num) && num >= 1 && num <= 12) {
        showActivity(num - 1);
        return;
      }
      showHome();
    } else {
      showHome();
    }
  }

  return {
    init,
    showHome,
    showActivity,
    showMapActivity
  };
})();

window.RideNavigation = RideNavigation;