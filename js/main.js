/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   MAIN.JS — Orquestador Principal de la Aplicación
   ======================================================== */

import { initNavigation } from './navigation.js';
import { initMap } from './map.js';
import { loadActivities, renderActivities } from './activities.js';
import { loadBartali, renderBartaliShowcase } from './bartali.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚴 Inicializando RIDE — Ponte en Marcha (IES José María Infantes)...');

  // 1. Cargar Datos en Paralelo
  const [activities, bartali] = await Promise.all([
    loadActivities(),
    loadBartali()
  ]);

  // 2. Inicializar Motor Cartográfico
  const map = initMap();

  // 3. Inicializar Galería Fotográfica
  initGallery();

  // 4. Inicializar Navegación e Interacciones
  initNavigation({
    onOpenView: (viewName) => {
      if (viewName === 'map') {
        // Redimensionar el mapa si estaba oculto o cambió de tamaño
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 100);
      }
    },
    onOpenActivities: () => {
      renderActivities('all');
    },
    onOpenBartali: () => {
      renderBartaliShowcase();
    }
  });

  // Render inicial de actividades en segundo plano
  renderActivities('all');

  console.log('✅ RIDE inicializado correctamente.');
});

