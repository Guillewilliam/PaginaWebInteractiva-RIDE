/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   ACTIVITIES.JS — Renderizado, Filtrado y Conexión con el Mapa
   ======================================================== */

import { focusRoute, resetAllRoutes, COORDS_IES_INFANTES, COORDS_AYUNTAMIENTO } from './map.js';

let activitiesData = [];

async function loadActivities() {
  try {
    const response = await fetch('data/activities.json');
    if (response.ok) {
      const json = await response.json();
      const parsed = Array.isArray(json)
        ? json
        : (json.activities || json.actividades || Object.values(json).find(Array.isArray));

      activitiesData = (Array.isArray(parsed) && parsed.length > 0)
        ? parsed
        : fallbackActivities;
    } else {
      activitiesData = fallbackActivities;
    }
  } catch (err) {
    console.warn('Usando datos de respaldo para las actividades:', err);
    activitiesData = fallbackActivities;
  }
  renderGrid();
}

export function renderActivities(filter = 'all') {
  const container = document.getElementById('drawer-content');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerBadge = document.getElementById('drawer-badge');
  const filtersBar = document.getElementById('drawer-filters');

  if (!container) return;

  if (drawerTitle) drawerTitle.textContent = '12 Actividades del Proyecto';
  if (drawerBadge) drawerBadge.textContent = 'Memoria Escolar';
  if (filtersBar) filtersBar.classList.remove('hidden');

  const filtered = filter === 'all'
    ? activitiesData
    : activitiesData.filter(act => act.categoria === filter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <p>No se encontraron actividades en esta categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(act => `
    <article class="activity-card" data-activity-id="${act.id}">
      <div class="activity-card-img-wrap">
        <img src="${act.imagen}" alt="${act.titulo}" class="activity-card-img" loading="lazy">
        <span class="activity-card-badge">${act.badge}</span>
      </div>
      <div class="activity-card-body">
        <div class="activity-number-pill">Actividad #${act.numero}</div>
        <h3 class="activity-card-title">${act.titulo}</h3>
        <h4 class="activity-card-subtitle">${act.subtitulo}</h4>
        <p class="activity-card-desc">${act.descripcion}</p>

        <div class="activity-card-meta">
          <div class="activity-meta-line">
            <strong>Periodo:</strong> <span>${act.periodo}</span>
          </div>
          <div class="activity-meta-line">
            <strong>Participantes:</strong> <span>${act.participantes}</span>
          </div>
          <div class="activity-meta-line">
            <strong>Destinatarios:</strong> <span>${act.publico_objetivo}</span>
          </div>
        </div>

        <ul class="activity-highlights">
          ${act.puntos_clave.map(pt => `<li>${pt}</li>`).join('')}
        </ul>

        <div class="activity-card-footer">
          ${getActionBtnForActivity(act)}
        </div>
      </div>
    </article>
  `).join('');

  setupFilterChips();
  setupActivityActions();
}

function getActionBtnForActivity(act) {
  if (act.id === 'diseno-rutas') {
    return `<button class="act-btn-map" data-map-action="all-routes">📍 Ver Red de Rutas en el Mapa</button>`;
  } else if (act.id === 'solicitudes-ayuntamiento') {
    return `<button class="act-btn-map" data-map-action="tramo-machado">⚠️ Ver Tramo Peligroso Solicitado</button>`;
  } else if (act.id === 'ciclotaller-bartali') {
    return `<button class="act-btn-bartali" data-bartali-action="open">🚲 Ver las 9 Bicicletas Bartali</button>`;
  } else if (act.id === 'masas-criticas') {
    return `<button class="act-btn-map" data-map-action="masa-critica">🚴 Ver Recorrido Masa Crítica</button>`;
  } else if (act.id === 'visita-ayuntamiento-futuro') {
    return `<button class="act-btn-map" data-map-action="ayuntamiento">🏛️ Ver Ayuntamiento en el Mapa</button>`;
  } else if (act.id === 'infatur-turismo') {
    return `<button class="act-btn-map" data-map-action="ies">🏫 Ver IES y Circuito en el Mapa</button>`;
  }
  return `<button class="act-btn-gallery" data-gallery-action="${act.categoria}">📸 Ver Fotos Relacionadas</button>`;
}

function setupActivityActions() {
  const container = document.getElementById('drawer-content');
  if (!container) return;

  container.querySelectorAll('[data-map-action]').forEach(btn => {
    btn.onclick = () => {
      const action = btn.getAttribute('data-map-action');
      const drawer = document.getElementById('slide-drawer');
      if (drawer) drawer.classList.remove('open');

      const navMap = document.getElementById('nav-map');
      if (navMap) navMap.click();

      setTimeout(() => {
        if (action === 'tramo-machado') {
          focusRoute('tramo-machado-jilguero');
        } else if (action === 'masa-critica') {
          focusRoute('r-masa');
        } else if (action === 'all-routes') {
          resetAllRoutes();
        } else if (action === 'ies') {
          const btnCenterIes = document.getElementById('btn-center-ies');
          if (btnCenterIes) btnCenterIes.click();
        } else if (action === 'ayuntamiento') {
          focusRoute('r-masa');
        }
      }, 150);
    };
  });

  container.querySelectorAll('[data-bartali-action]').forEach(btn => {
    btn.onclick = () => {
      const navBartali = document.getElementById('nav-bartali');
      if (navBartali) navBartali.click();
    };
  });

  container.querySelectorAll('[data-gallery-action]').forEach(btn => {
    btn.onclick = () => {
      const navGallery = document.getElementById('nav-gallery');
      if (navGallery) navGallery.click();
    };
  });
}

function setupFilterChips() {
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.onclick = () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      renderActivities(filter);
    };
  });
}
