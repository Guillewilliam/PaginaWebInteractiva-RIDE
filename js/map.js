/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   MAP.JS — Motor Cartográfico Leaflet, Capas GeoJSON y Foco
   ======================================================== */

// Coordenadas clave de Utrera
export const COORDS_IES_INFANTES = [37.18347, -5.77160];
export const COORDS_AYUNTAMIENTO = [37.18182, -5.78045];
export const COORDS_CONSOLACION = [37.18950, -5.76120];

let map = null;
let satLayer = null;
let streetLayer = null;
let activeBaseLayer = 'sat';

// Colección de capas y polilíneas
export const layerGroups = {
  verde: null,
  azul: null,
  rojo: null,
  negro: null,
  pois: null
};

// Registro de capas de rutas para efectos de foco/atenuación
const routeLayersMap = new Map();
let currentFocusedRouteId = null;

// Estilos cromáticos oficiales de la memoria
const CATEGORY_STYLES = {
  verde: {
    color: '#27ae60',
    weight: 5,
    opacity: 0.92,
    dashArray: null,
    lineCap: 'round',
    lineJoin: 'round'
  },
  azul: {
    color: '#2980b9',
    weight: 5,
    opacity: 0.92,
    dashArray: null,
    lineCap: 'round',
    lineJoin: 'round'
  },
  rojo: {
    color: '#e74c3c',
    weight: 5,
    opacity: 0.88,
    dashArray: '6, 6',
    lineCap: 'round',
    lineJoin: 'round'
  },
  negro: {
    color: '#1c2833',
    weight: 6,
    opacity: 0.95,
    dashArray: '8, 4',
    lineCap: 'round',
    lineJoin: 'round'
  }
};

export async function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return null;

  // 1. Inicializar Mapa centrado en el IES José María Infantes
  map = L.map('map', {
    center: COORDS_IES_INFANTES,
    zoom: 15,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // 2. Capa Satélite Aérea de Alta Resolución (Esri World Imagery)
  satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Imágenes satélite &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19
  });

  // 3. Capa Callejero Vectorial Claro (CartoDB Voyager)
  streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  // Capa aérea activa por defecto
  satLayer.addTo(map);

  // 4. Inicializar Grupos de Capas
  layerGroups.verde = L.layerGroup().addTo(map);
  layerGroups.azul = L.layerGroup().addTo(map);
  layerGroups.rojo = L.layerGroup().addTo(map);
  layerGroups.negro = L.layerGroup().addTo(map);
  layerGroups.pois = L.layerGroup().addTo(map);

  // 5. Cargar Datos GeoJSON (Rutas y Puntos)
  await loadGeoJSONData();

  // 6. Configurar Controles Flotantes y Leyenda
  setupMapControls();
  setupLegendToggles();

  return map;
}

async function loadGeoJSONData() {
  try {
    const [routesRes, pointsRes] = await Promise.all([
      fetch('data/routes.geojson'),
      fetch('data/points.geojson')
    ]);

    const routesGeoJSON = await routesRes.json();
    const pointsGeoJSON = await pointsRes.json();

    // Renderizar Rutas
    renderRoutes(routesGeoJSON);

    // Renderizar Marcadores de Puntos de Interés
    renderPoints(pointsGeoJSON);

    console.log(`✅ GeoJSON cargado: ${routesGeoJSON.features.length} rutas y ${pointsGeoJSON.features.length} puntos.`);
  } catch (err) {
    console.error('Error cargando archivos GeoJSON:', err);
  }
}

function renderRoutes(geojsonData) {
  routeLayersMap.clear();

  L.geoJSON(geojsonData, {
    style: (feature) => {
      const cat = feature.properties.categoria || 'verde';
      return { ...CATEGORY_STYLES[cat] };
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      const cat = p.categoria || 'verde';

      // Registrar en el mapa de capas
      routeLayersMap.set(p.id, { layer, properties: p });

      // Añadir al grupo de su categoría cromática
      if (layerGroups[cat]) {
        layerGroups[cat].addLayer(layer);
      }

      // Tooltip informativo al pasar el cursor
      const catLabels = {
        verde: 'Carril Bici Protegido',
        azul: 'Carril sobre Acera',
        rojo: 'Zona 30 Compartida',
        negro: 'Tramo Peligroso / Solicitado'
      };

      const sourceBadges = {
        oficial_documentada: '⭐ Documentada Oficial',
        solicitud_municipal: '📝 Solicitud al Ayuntamiento',
        reconstruccion_orientativa: '📐 Reconstrucción Escolar'
      };

      layer.bindTooltip(`
        <div style="font-family: var(--font-body); padding: 2px;">
          <strong style="color: var(--ride-blue); font-size: 0.88rem;">${p.name}</strong><br>
          <span style="font-size: 0.75rem; color: #555;">${catLabels[cat]} · ${p.distancia_km} km</span><br>
          <span style="font-size: 0.7rem; font-weight: 600; color: #27ae60;">${sourceBadges[p.tipo_fuente] || ''}</span>
        </div>
      `, { sticky: true, opacity: 0.95 });

      // Interacciones de ratón
      layer.on('mouseover', () => {
        if (currentFocusedRouteId !== p.id) {
          layer.setStyle({
            weight: (CATEGORY_STYLES[cat].weight || 5) + 3,
            opacity: 1
          });
        }
      });

      layer.on('mouseout', () => {
        if (currentFocusedRouteId !== p.id) {
          const isAnyFocused = currentFocusedRouteId !== null;
          layer.setStyle({
            ...CATEGORY_STYLES[cat],
            opacity: isAnyFocused ? 0.22 : CATEGORY_STYLES[cat].opacity
          });
        }
      });

      // Clic para enfocar y desplegar ficha
      layer.on('click', () => {
        focusRoute(p.id);
      });
    }
  });
}

function renderPoints(geojsonData) {
  L.geoJSON(geojsonData, {
    pointToLayer: (feature, latlng) => {
      const p = feature.properties;
      const iconHtml = getMarkerIconHtml(p);

      const customIcon = L.divIcon({
        className: `custom-map-marker marker-${p.tipo}`,
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker(latlng, { icon: customIcon });

      marker.bindPopup(`
        <div class="custom-popup-title">${p.name}</div>
        <div class="custom-popup-body">
          <p>${p.descripcion}</p>
          <small style="color: #666; display: block; margin-top: 4px;">📍 ${p.direccion}</small>
        </div>
      `);

      marker.on('click', () => {
        handlePointClick(p);
      });

      layerGroups.pois.addLayer(marker);
      return marker;
    }
  });
}

function getMarkerIconHtml(p) {
  let bgColor = '#1e824c';
  if (p.tipo === 'instituto') bgColor = '#1e824c';
  else if (p.tipo === 'institucional') bgColor = '#003399';
  else if (p.tipo === 'taller') bgColor = '#d4ac0d';
  else if (p.tipo === 'parque') bgColor = '#27ae60';
  else if (p.tipo === 'transporte') bgColor = '#8e44ad';
  else if (p.tipo === 'peligro') bgColor = '#c0392b';

  return `
    <div style="background:${bgColor}; color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.15rem; box-shadow:0 3px 10px rgba(0,0,0,0.35); border:2px solid #ffffff; transition: transform 0.2s;">
      ${p.icono || '📍'}
    </div>
  `;
}

function handlePointClick(p) {
  const badgeColors = {
    instituto: { bg: '#e8f8f0', color: '#1e824c', text: 'Centro Educativo' },
    institucional: { bg: '#ebf5fb', color: '#003399', text: 'Institucional' },
    taller: { bg: '#fef9e7', color: '#d4ac0d', text: 'Ciclotaller Bartali' },
    parque: { bg: '#e8f8f0', color: '#27ae60', text: 'Espacio Verde' },
    transporte: { bg: '#f4ecf7', color: '#8e44ad', text: 'Intermodal' },
    peligro: { bg: '#fdedec', color: '#c0392b', text: 'Punto Peligroso' }
  };

  const badgeInfo = badgeColors[p.tipo] || { bg: '#f4f6f8', color: '#333', text: 'Punto de Interés' };

  showContextCard({
    tipo: p.tipo,
    titulo: p.name,
    badge: badgeInfo.text,
    badgeColor: badgeInfo.color,
    badgeBg: badgeInfo.bg,
    desc: p.descripcion,
    meta1: p.direccion,
    meta2: p.coordenadas_str,
    btnText: p.tipo === 'instituto' ? 'Abrir Ficha del IES' : (p.tipo === 'taller' ? 'Ver Bicicletas Bartali' : null),
    onAction: () => {
      if (p.tipo === 'instituto') {
        const modal = document.getElementById('modal-ies');
        if (modal) modal.classList.remove('hidden');
      } else if (p.tipo === 'taller') {
        const navBartali = document.getElementById('nav-bartali');
        if (navBartali) navBartali.click();
      }
    }
  });
}

// ========================================================
// FUNCIÓN DE ENFOQUE Y ATENUACIÓN DE RUTAS
// ========================================================
export function focusRoute(routeId) {
  if (!routeLayersMap.has(routeId)) {
    resetAllRoutes();
    return;
  }

  currentFocusedRouteId = routeId;
  const target = routeLayersMap.get(routeId);
  const p = target.properties;
  const targetLayer = target.layer;

  // Actualizar selector de rutas en la interfaz
  const selector = document.getElementById('route-selector');
  if (selector && selector.value !== routeId) {
    selector.value = routeId;
  }

  // Atenuar todas las rutas excepto la seleccionada
  routeLayersMap.forEach(({ layer, properties }, id) => {
    const cat = properties.categoria || 'verde';
    if (id === routeId) {
      layer.setStyle({
        color: CATEGORY_STYLES[cat].color,
        weight: 8,
        opacity: 1
      });
      layer.bringToFront();
    } else {
      layer.setStyle({
        color: CATEGORY_STYLES[cat].color,
        weight: CATEGORY_STYLES[cat].weight,
        opacity: 0.18
      });
    }
  });

  // Encuadrar la cámara suavemente en la ruta seleccionada
  map.fitBounds(targetLayer.getBounds(), {
    padding: [60, 60],
    maxZoom: 16,
    duration: 1
  });

  // Mostrar tarjeta contextual enriquecida
  const sourceLabels = {
    oficial_documentada: 'Documentación Oficial RIDE',
    solicitud_municipal: 'Petición Formal al Ayuntamiento',
    reconstruccion_orientativa: 'Reconstrucción por Barrios'
  };

  const catColors = {
    verde: { bg: '#e8f8f0', color: '#27ae60', name: 'Carril Bici Protegido' },
    azul: { bg: '#ebf5fb', color: '#2980b9', name: 'Carril sobre Acera' },
    rojo: { bg: '#fdedec', color: '#e74c3c', name: 'Zona 30 Compartida' },
    negro: { bg: '#e2e8f0', color: '#1c2833', name: 'Tramo Peligroso' }
  };

  const catInfo = catColors[p.categoria] || catColors.verde;

  showContextCard({
    tipo: 'ruta',
    titulo: p.name,
    badge: `${catInfo.name} · ${sourceLabels[p.tipo_fuente] || ''}`,
    badgeColor: catInfo.color,
    badgeBg: catInfo.bg,
    desc: `${p.descripcion} <br><br><strong>📌 En la memoria:</strong> <em>«${p.evidencia_memoria}»</em><br><br><strong>🛡️ Decálogo RIDE:</strong> <em>«${p.consejos_decalogo}»</em>`,
    meta1: `Longitud: ${p.distancia_km} km`,
    meta2: `Dificultad: ${p.dificultad.toUpperCase()}`,
    btnText: p.categoria === 'negro' ? 'Ver Solicitud Municipal en Actividades' : 'Explorar Actividades',
    onAction: () => {
      const navActivities = document.getElementById('nav-activities');
      if (navActivities) navActivities.click();
    }
  });
}

export function resetAllRoutes() {
  currentFocusedRouteId = null;

  routeLayersMap.forEach(({ layer, properties }) => {
    const cat = properties.categoria || 'verde';
    layer.setStyle({
      ...CATEGORY_STYLES[cat]
    });
  });

  // Encuadrar todo Utrera
  const bounds = L.latLngBounds(
    [37.168, -5.795],
    [37.198, -5.750]
  );
  map.fitBounds(bounds, { padding: [40, 40], duration: 1.2 });

  // Ocultar tarjeta de contexto
  const card = document.getElementById('map-context-card');
  if (card) card.classList.add('hidden');
}

// ========================================================
// CONTROLES FLOTANTES Y LEYENDA
// ========================================================
function setupMapControls() {
  const btnSat = document.getElementById('btn-layer-sat');
  const btnStreets = document.getElementById('btn-layer-streets');
  const btnCenterIes = document.getElementById('btn-center-ies');
  const btnFitBounds = document.getElementById('btn-fit-bounds');
  const routeSelector = document.getElementById('route-selector');

  if (btnSat) {
    btnSat.addEventListener('click', () => {
      if (activeBaseLayer !== 'sat') {
        map.removeLayer(streetLayer);
        map.addLayer(satLayer);
        activeBaseLayer = 'sat';
        btnSat.classList.add('active');
        if (btnStreets) btnStreets.classList.remove('active');
      }
    });
  }

  if (btnStreets) {
    btnStreets.addEventListener('click', () => {
      if (activeBaseLayer !== 'streets') {
        map.removeLayer(satLayer);
        map.addLayer(streetLayer);
        activeBaseLayer = 'streets';
        btnStreets.classList.add('active');
        if (btnSat) btnSat.classList.remove('active');
      }
    });
  }

  if (btnCenterIes) {
    btnCenterIes.addEventListener('click', () => {
      map.flyTo(COORDS_IES_INFANTES, 16, { duration: 1.2 });
      // Destacar marcador IES
      const iesTarget = routeLayersMap.get('tramo-machado-jilguero');
      if (iesTarget) focusRoute('tramo-machado-jilguero');
    });
  }

  if (btnFitBounds) {
    btnFitBounds.addEventListener('click', () => {
      const selector = document.getElementById('route-selector');
      if (selector) selector.value = 'all';
      resetAllRoutes();
    });
  }

  if (routeSelector) {
    routeSelector.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'all') {
        resetAllRoutes();
      } else if (val === 'tramos-negros') {
        focusRoute('tramo-machado-jilguero');
      } else {
        focusRoute(val);
      }
    });
  }
}

function setupLegendToggles() {
  const toggleBtn = document.getElementById('btn-toggle-legend');
  const legendCard = document.getElementById('map-legend');

  if (toggleBtn && legendCard) {
    toggleBtn.addEventListener('click', () => {
      legendCard.classList.toggle('collapsed');
      toggleBtn.textContent = legendCard.classList.contains('collapsed') ? '+' : '−';
    });
  }

  // Toggles de capas individuales
  const toggles = {
    verde: document.getElementById('toggle-verde'),
    azul: document.getElementById('toggle-azul'),
    rojo: document.getElementById('toggle-rojo'),
    negro: document.getElementById('toggle-negro')
  };

  Object.entries(toggles).forEach(([tipo, input]) => {
    if (input) {
      input.addEventListener('change', () => {
        const group = layerGroups[tipo];
        if (group) {
          if (input.checked) {
            map.addLayer(group);
          } else {
            map.removeLayer(group);
          }
        }
      });
    }
  });

  const closeContextBtn = document.getElementById('btn-close-context');
  const contextCard = document.getElementById('map-context-card');
  if (closeContextBtn && contextCard) {
    closeContextBtn.addEventListener('click', () => {
      contextCard.classList.add('hidden');
      if (currentFocusedRouteId) {
        resetAllRoutes();
      }
    });
  }
}

export function showContextCard(info) {
  const card = document.getElementById('map-context-card');
  const content = document.getElementById('context-card-content');
  if (!card || !content) return;

  content.innerHTML = `
    <span class="context-header-badge" style="background:${info.badgeBg}; color:${info.badgeColor};">
      ● ${info.badge}
    </span>
    <h3 class="context-title">${info.titulo}</h3>
    <div class="context-desc">${info.desc}</div>
    <div class="context-meta-row">
      <div class="context-meta-item">
        <span class="context-meta-label">Referencia</span>
        <span class="context-meta-val">${info.meta1}</span>
      </div>
      <div class="context-meta-item">
        <span class="context-meta-label">Detalle</span>
        <span class="context-meta-val">${info.meta2}</span>
      </div>
    </div>
    ${info.btnText ? `<button class="context-action-btn" id="context-modal-btn">${info.btnText}</button>` : ''}
  `;

  card.classList.remove('hidden');

  const actionBtn = document.getElementById('context-modal-btn');
  if (actionBtn && info.onAction) {
    actionBtn.onclick = info.onAction;
  }
}
