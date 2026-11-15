/**
 * Módulo cartográfico blindado para la Actividad 13:
 * "Rutas ciclistas de Utrera"
 */
let rideMapInstance = null;
let mapInitialized = false;

const UTRERA_CENTER = [37.1825, -5.7815];
const UTRERA_ZOOM = 14;

function getRouteStyle(feature) {
  const props = feature.properties || {};
  const rawType = String(
    props.tipo || props.type || props.categoria || props.category || props.estado || ''
  ).toLowerCase();

  let color = '#16a34a';
  let dashArray = null;

  if (rawType.includes('compartid') || rawType.includes('ciclocalle') || rawType.includes('urbana')) {
    color = '#2563eb';
  } else if (rawType.includes('senda') || rawType.includes('rural') || rawType.includes('camino') || rawType.includes('verde')) {
    color = '#d97706';
  } else if (rawType.includes('precaucion') || rawType.includes('enlace') || rawType.includes('propuest') || rawType.includes('critico')) {
    color = '#dc2626';
    dashArray = '8, 6';
  } else if (props.color) {
    color = props.color;
  }

  return {
    color,
    weight: 5,
    opacity: 0.92,
    dashArray
  };
}

function showInfoPanel(title, htmlBody) {
  const panel = document.getElementById('map-info-panel');
  const content = document.getElementById('map-info-content');
  if (!panel || !content) return;

  content.innerHTML = `
    <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem; padding-right:1.5rem;">
      ${title}
    </h3>
    <div style="font-size:0.93rem; color:#334155; line-height:1.55;">
      ${htmlBody}
    </div>
  `;
  panel.classList.remove('hidden');
}

function buildPropertiesHtml(props) {
  if (!props) return '<p>Recorrido perteneciente a la red ciclista de Utrera.</p>';

  const description = props.descripcion || props.description || props.detalle || '';
  const distance = props.distancia || props.distance || props.longitud || '';
  const difficulty = props.dificultad || props.difficulty || '';
  const type = props.tipo || props.type || props.categoria || '';

  let html = '';
  if (description) html += `<p style="margin-bottom:0.65rem;">${description}</p>`;

  const meta = [];
  if (type) meta.push(`<strong>Tipo de vía:</strong> ${type}`);
  if (distance) meta.push(`<strong>Distancia:</strong> ${distance}`);
  if (difficulty) meta.push(`<strong>Dificultad:</strong> ${difficulty}`);

  if (meta.length > 0) {
    html += `<ul style="list-style:none; display:flex; flex-direction:column; gap:0.3rem; background:#f8fafc; padding:0.7rem; border-radius:10px; border:1px solid #e2e8f0;">
      ${meta.map((item) => `<li>${item}</li>`).join('')}
    </ul>`;
  }

  return html || '<p>Itinerario ciclista cartografiado dentro del Proyecto RIDE en Utrera.</p>';
}

function addLayerToggle(containerId, labelText, colorHex, leafletLayer, checked = true) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const label = document.createElement('label');
  label.style.cssText =
    'display:flex; align-items:center; gap:0.55rem; font-size:0.88rem; font-weight:600; color:#1e293b; cursor:pointer; padding:0.3rem 0.4rem; border-radius:8px;';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.style.cssText = 'width:16px; height:16px; accent-color:#15803d; cursor:pointer;';

  const dot = document.createElement('span');
  dot.style.cssText = `display:inline-block; width:12px; height:12px; border-radius:50%; background:${colorHex}; flex-shrink:0;`;

  const text = document.createElement('span');
  text.textContent = labelText;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      leafletLayer.addTo(rideMapInstance);
    } else {
      rideMapInstance.removeLayer(leafletLayer);
    }
  });

  label.appendChild(checkbox);
  label.appendChild(dot);
  label.appendChild(text);
  container.appendChild(label);
}

async function loadGeoJsonLayers() {
  const routeSelectors = document.getElementById('route-selectors');
  const poiSelectors = document.getElementById('poi-selectors');
  if (routeSelectors) routeSelectors.innerHTML = '';
  if (poiSelectors) poiSelectors.innerHTML = '';

  try {
    const resRoutes = await fetch('./data/routes.geojson');
    if (resRoutes.ok) {
      const routesData = await resRoutes.json();
      const features = routesData.features || [];

      if (features.length > 0) {
        const allBounds = window.L.latLngBounds([]);

        features.forEach((feature, idx) => {
          const props = feature.properties || {};
          const routeName =
            props.nombre || props.name || props.titulo || `Ruta ciclista ${idx + 1}`;
          const style = getRouteStyle(feature);

          const singleRouteLayer = window.L.geoJSON(feature, {
            style: () => style,
            onEachFeature: (feat, layer) => {
              layer.on('mouseover', () => layer.setStyle({ weight: 8, opacity: 1 }));
              layer.on('mouseout', () => layer.setStyle(style));
              layer.on('click', () => {
                showInfoPanel(routeName, buildPropertiesHtml(feat.properties));
              });
            }
          }).addTo(rideMapInstance);

          if (singleRouteLayer.getBounds().isValid()) {
            allBounds.extend(singleRouteLayer.getBounds());
          }

          addLayerToggle('route-selectors', routeName, style.color, singleRouteLayer, true);
        });

        if (allBounds.isValid()) {
          rideMapInstance.fitBounds(allBounds, { padding: [45, 45] });
        }
      }
    } else {
      console.warn('HTTP status al cargar routes.geojson:', resRoutes.status);
    }
  } catch (err) {
    console.warn('Aviso cargando routes.geojson:', err);
  }

  try {
    const resPoints = await fetch('./data/points.geojson');
    if (resPoints.ok) {
      const pointsData = await resPoints.json();
      const pointsLayer = window.L.geoJSON(pointsData, {
        pointToLayer: (feature, latlng) => {
          return window.L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#0284c7',
            color: '#ffffff',
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.95
          });
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          const title = props.nombre || props.name || props.titulo || 'Punto de interés';
          layer.bindTooltip(title, { direction: 'top', offset: [0, -6] });
          layer.on('click', () => {
            showInfoPanel(title, buildPropertiesHtml(props));
          });
        }
      }).addTo(rideMapInstance);

      addLayerToggle(
        'poi-selectors',
        'Centros educativos y puntos clave',
        '#0284c7',
        pointsLayer,
        true
      );
    }
  } catch (err) {
    console.warn('Aviso cargando points.geojson:', err);
  }
}

export function initRideMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('No se encontró el contenedor #map en el DOM.');
    return null;
  }

  if (typeof window.L === 'undefined') {
    console.error('Leaflet (window.L) no está cargado. Revisa el script de Leaflet en index.html.');
    return null;
  }

  // Garantiza dimensiones reales incluso si algún CSS externo intenta colapsarlo
  mapContainer.style.width = '100%';
  mapContainer.style.height = '100%';
  mapContainer.style.minHeight = 'calc(100vh - 76px)';

  if (mapInitialized && rideMapInstance) {
    rideMapInstance.invalidateSize();
    return rideMapInstance;
  }

  rideMapInstance = window.L.map('map', {
    center: UTRERA_CENTER,
    zoom: UTRERA_ZOOM,
    zoomControl: true
  });

  // Capa base principal OpenStreetMap + respaldo automático si alguna tesela falla
  const osmLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors · Proyecto RIDE Utrera'
  });

  osmLayer.on('tileerror', () => {
    if (!rideMapInstance.hasLayer(fallbackLayer)) {
      fallbackLayer.addTo(rideMapInstance);
    }
  });

  const fallbackLayer = window.L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO · Proyecto RIDE Utrera'
    }
  );

  osmLayer.addTo(rideMapInstance);

  mapInitialized = true;
  window.rideMap = rideMapInstance;

  loadGeoJsonLayers();

  setTimeout(() => {
    rideMapInstance.invalidateSize();
  }, 250);

  return rideMapInstance;
}

window.initRideMap = initRideMap;