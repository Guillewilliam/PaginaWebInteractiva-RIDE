/**
 * Renderizado editorial de las 12 actividades del Proyecto RIDE
 * más la Actividad 13 (Rutas ciclistas de Utrera) como experiencia cartográfica.
 */
import { RideNavigation } from './navigation.js';

export const RideActivities = (() => {
  let activitiesData = [];

  const fallbackActivities = [
    {
      id: 1,
      title: 'Campaña Ven al Insti en Bici',
      shortDescription: 'Fomento del desplazamiento activo y seguro hacia los centros educativos de Utrera.',
      image: 'assets/images/cartel-ven-al-insti.jpg',
      content: 'Iniciativa dirigida a alumnado y familias para promover los desplazamientos cotidianos en bicicleta al instituto.'
    },
    {
      id: 2,
      title: 'Ciclotaller Bartali',
      shortDescription: 'Mecánica básica, mantenimiento preventivo y puesta a punto de bicicletas.',
      image: 'assets/images/ciclotaller-bartali.jpg',
      content: 'Taller práctico de reparación y ajuste de bicicletas inspirado en los valores del ciclismo educativo.'
    },
    {
      id: 3,
      title: 'Masa Crítica Escolar',
      shortDescription: 'Marcha ciclista colectiva por las calles de Utrera reivindicando una ciudad amable.',
      image: 'assets/images/masa-critica.jpg',
      content: 'Recorrido urbano en grupo para visibilizar la presencia de la bicicleta en el espacio público.'
    },
    {
      id: 4,
      title: 'Movilidad Sostenible en Europa',
      shortDescription: 'Intercambio de buenas prácticas y experiencias ciclistas a nivel europeo.',
      image: 'assets/images/movilidad-europa.jpg',
      content: 'Conocimiento de modelos europeos de infraestructura ciclista y pacificación del tráfico.'
    },
    {
      id: 5,
      title: 'Presentación Institucional en el Ayuntamiento',
      shortDescription: 'Propuestas juveniles de mejora de la red ciclista trasladadas al consistorio.',
      image: 'assets/images/visita-ayuntamiento.jpg',
      content: 'Encuentro con representantes municipales para compartir diagnósticos y mejoras de movilidad.'
    },
    {
      id: 6,
      title: 'Stand Divulgativo INFATUR',
      shortDescription: 'Difusión del proyecto RIDE y sensibilización ciudadana en feria local.',
      image: 'assets/images/infatur-stand.jpg',
      content: 'Espacio abierto de información sobre rutas saludables y uso cotidiano de la bicicleta.'
    },
    {
      id: 7,
      title: 'Diseño de Tríptico Informativo',
      shortDescription: 'Material gráfico con recomendaciones de circulación y beneficios de la movilidad activa.',
      image: 'assets/images/triptico-exterior.jpg',
      content: 'Guía de bolsillo elaborada dentro del proyecto para difundir normas y consejos ciclistas.'
    },
    {
      id: 8,
      title: 'Guía Práctica de Circulación Segura',
      shortDescription: 'Señalización, equipamiento obligatorio y convivencia vial en entornos urbanos.',
      image: 'assets/images/triptico-interior.jpg',
      content: 'Contenidos didácticos centrados en la seguridad vial y el respeto entre peatones, ciclistas y vehículos.'
    },
    {
      id: 9,
      title: 'Exposición y Roll-Up RIDE',
      shortDescription: 'Paneles itinerantes con los hitos, objetivos y resultados del proyecto.',
      image: 'assets/images/cartel-rollup.jpg',
      content: 'Soporte expositivo para jornadas educativas y eventos de sensibilización ambiental.'
    },
    {
      id: 10,
      title: 'Cartografía Participativa y Análisis de Vías',
      shortDescription: 'Trabajo de campo sobre plano para identificar conexiones y puntos críticos.',
      image: 'assets/images/mapa-recortes-p10.jpg',
      content: 'Análisis territorial realizado para diseñar itinerarios ciclistas seguros en Utrera.'
    },
    {
      id: 11,
      title: 'Educación Vial y Destreza Ciclista',
      shortDescription: 'Circuitos de habilidad, equilibrio y control de la bicicleta en entorno protegido.',
      image: 'assets/images/ciclotaller-bartali.jpg',
      content: 'Sesiones prácticas para ganar confianza antes de circular por vías compartidas.'
    },
    {
      id: 12,
      title: 'Identidad y Comunicación RIDE',
      shortDescription: 'Imagen corporativa, difusión digital y memoria gráfica de toda la experiencia.',
      image: 'assets/images/logo-ride.jpg',
      content: 'Recopilación audiovisual y documental del impacto del proyecto en la comunidad educativa.'
    }
  ];

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

  function renderGrid() {
    const grid = document.getElementById('activities-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 1. Renderizar las 12 actividades principales como banners interactivos
    activitiesData.slice(0, 12).forEach((act, idx) => {
      const num = idx + 1;
      const title = act.title || act.titulo || `Actividad ${num}`;
      const desc = act.shortDescription || act.descripcion || act.description || '';
      const img = act.image || act.imagen || 'assets/images/logo-ride.jpg';

      const banner = document.createElement('article');
      banner.className = 'activity-banner';
      banner.setAttribute('role', 'button');
      banner.setAttribute('tabindex', '0');
      banner.setAttribute('aria-label', `Abrir actividad ${num}: ${title}`);

      banner.innerHTML = `
        <img src="${img}" alt="${title}" class="activity-banner-img" loading="lazy" />
        <div class="activity-banner-overlay"></div>
        <div class="activity-banner-content">
          <span class="activity-banner-number">Actividad ${num}</span>
          <h2 class="activity-banner-title">${num}. ${title}</h2>
          ${desc ? `<p class="activity-banner-desc">${desc}</p>` : ''}
        </div>
      `;

      const openHandler = () => RideNavigation.showActivity(idx);
      banner.addEventListener('click', openHandler);
      banner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openHandler();
        }
      });

      grid.appendChild(banner);
    });

    // 2. Renderizar la Actividad 13: Rutas ciclistas de Utrera (Mapa interactivo)
    const mapBanner = document.createElement('article');
    mapBanner.className = 'activity-banner banner-map-featured';
    mapBanner.setAttribute('role', 'button');
    mapBanner.setAttribute('tabindex', '0');
    mapBanner.setAttribute('aria-label', 'Abrir Actividad 13: Rutas ciclistas de Utrera');

    mapBanner.innerHTML = `
      <img src="assets/maps/mapa_osm_utrera.jpg" alt="Mapa de rutas ciclistas de Utrera" class="activity-banner-img" />
      <div class="activity-banner-overlay"></div>
      <div class="activity-banner-content">
        <span class="activity-banner-number">Actividad 13 · Mapa Interactivo</span>
        <h2 class="activity-banner-title">13. Rutas ciclistas de Utrera</h2>
        <p class="activity-banner-desc">
          Explora el mapa interactivo de Utrera con todos los recorridos ciclistas, clasificación de vías, capas y puntos de interés.
        </p>
      </div>
    `;

    const openMapHandler = () => RideNavigation.showMapActivity();
    mapBanner.addEventListener('click', openMapHandler);
    mapBanner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMapHandler();
      }
    });

    grid.appendChild(mapBanner);
  }

  function renderDetail(index) {
    const container = document.getElementById('activity-article-content');
    const badge = document.getElementById('detail-step-badge');
    const act = activitiesData[index];
    if (!container || !act) return;

    const num = index + 1;
    const title = act.title || act.titulo || `Actividad ${num}`;
    const img = act.image || act.imagen || 'assets/images/logo-ride.jpg';
    const fullText = act.content || act.contenido || act.descripcion || act.shortDescription || '';

    if (badge) badge.textContent = `Actividad ${num} de 13`;

    container.innerHTML = `
      <img src="${img}" alt="${title}" class="article-hero-image" />
      <div class="article-body">
        <h1>${num}. ${title}</h1>
        <p>${fullText}</p>
        ${act.extraHtml || ''}
      </div>
    `;
  }

  function getCount() {
    return Math.min(activitiesData.length, 12);
  }

  return {
    loadActivities,
    renderDetail,
    getCount
  };
})();

window.RideActivities = RideActivities;