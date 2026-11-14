/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   GALLERY.JS — Álbum Editorial Scrapbook y Visor Lightbox
   ======================================================== */

const photosData = [
  {
    id: "img-logo",
    titulo: "Logotipo Oficial RIDE",
    categoria: "carteleria",
    categoriaLabel: "Diseño & Identidad",
    fecha: "Curso 2024-25",
    src: "assets/images/logo-ride.jpg",
    descripcion: "Propuesta seleccionada de la alumna Cristina Aparicio (1º Bachillerato de Arte). Integra la bicicleta central, la inclusión de todas las edades y géneros, el compromiso ambiental (verde) y la dimensión europea Erasmus+ (azul y amarillo)."
  },
  {
    id: "img-rollup",
    titulo: "Cartel Oficial de la Campaña (Roll-up)",
    categoria: "carteleria",
    categoriaLabel: "Campaña Institucional",
    fecha: "Curso 2025-26",
    src: "assets/images/cartel-rollup.jpg",
    descripcion: "Roll-up de gran formato expuesto en el vestíbulo del IES José María Infantes y en jornadas de difusión, con el eslogan oficial: «Circula con respeto, Disfruta del camino, Aprende y colabora, Construye tu futuro»."
  },
  {
    id: "img-ven-insti",
    titulo: "Cartel Concurso «Ven al Insti en Bici»",
    categoria: "carteleria",
    categoriaLabel: "Concurso Escolar",
    fecha: "Mayo 2025 / 2026",
    src: "assets/images/cartel-ven-al-insti.jpg",
    descripcion: "Diseño original de la alumna Yaiza Rodríguez (3º ESO) en la materia de Expresión Plástica. Animó la participación diaria de estudiantes con premios financiados por Erasmus+ (luces, timbres, candados y aparcamiento VIP)."
  },
  {
    id: "img-triptico-ext",
    titulo: "Tríptico Divulgativo (Portada y Contexto)",
    categoria: "carteleria",
    categoriaLabel: "Material Divulgativo",
    fecha: "Curso 2025-26",
    src: "assets/images/triptico-exterior.jpg",
    descripcion: "Folleto informativo de mano con el cartel principal, los objetivos de la candidatura al IX Concurso Escolar 'Ponte en Marcha' y la justificación pedagógica comunitaria."
  },
  {
    id: "img-triptico-int",
    titulo: "Tríptico Divulgativo (Interior con Evidencias)",
    categoria: "carteleria",
    categoriaLabel: "Memoria Gráfica",
    fecha: "Curso 2025-26",
    src: "assets/images/triptico-interior.jpg",
    descripcion: "Páginas interiores del folleto resumiendo el ciclotaller, las rutas, las clases de educación vial y fotografías del alumnado participante."
  },
  {
    id: "img-bartali",
    titulo: "Alumnado Reparando Bicis en el Taller Bartali",
    categoria: "bartali",
    categoriaLabel: "Ciclotaller Solidario",
    fecha: "Recreos Activos 2024-2026",
    src: "assets/images/ciclotaller-bartali.jpg",
    descripcion: "Alumnos voluntarios aprendiendo mecánica básica, ajuste de frenos y cambios en el antiguo almacén del centro. Gracias a la donación de casi 50 bicicletas por familias, se han puesto a punto 9 unidades para préstamo."
  },
  {
    id: "img-masa-critica",
    titulo: "Masa Crítica por las Calles de Utrera",
    categoria: "masacritica",
    categoriaLabel: "Visibilidad Urbana",
    fecha: "2º Trimestre",
    src: "assets/images/masa-critica.jpg",
    descripcion: "Rodada colectiva de hasta 59 alumnos y docentes. El alumnado aprende que no es una protesta, sino una lección de cortesía vial bajo el lema: «Los ciclistas no interrumpen el tráfico, somos tráfico»."
  },
  {
    id: "img-infatur",
    titulo: "Stand RIDE y Circuito Ciclista en INFATUR",
    categoria: "infatur",
    categoriaLabel: "Feria de Turismo",
    fecha: "Mayo 2025 / 2026",
    src: "assets/images/infatur-stand.jpg",
    descripcion: "Stand de sensibilización con banderas europeas, tándem y triciclo adaptado. En el patio se trazó un circuito con señales de tráfico cedidas por el Ayuntamiento para practicar normas con visitantes y 6º de Primaria."
  },
  {
    id: "img-ayuntamiento",
    titulo: "Recepción Institucional en el Ayuntamiento",
    categoria: "ayuntamiento",
    categoriaLabel: "Ciudadanía Activa",
    fecha: "Octubre 2025 (Erasmus Days)",
    src: "assets/images/visita-ayuntamiento.jpg",
    descripcion: "Cuarenta estudiantes y cuatro profesores recibidos en el consistorio por los concejales de Movilidad Urbana, Educación y Cultura para entregar sus mapas ciclistas y solicitar mejoras en puntos negros."
  },
  {
    id: "img-europa",
    titulo: "Investigación Ciclista en Soest (Alemania)",
    categoria: "europa",
    categoriaLabel: "Movilidades Erasmus+",
    fecha: "Curso 2024-25",
    src: "assets/images/movilidad-europa.jpg",
    descripcion: "Estudio de las infraestructuras de Westfalia y la estación Radstation (SEN) en Alemania, así como cicloficinas populares en Roma, inspiración directa para el Ciclotaller Bartali."
  },
  {
    id: "img-mapa-p10",
    titulo: "Captura de Mapeo en Google Earth (Página 10)",
    categoria: "cartografia",
    categoriaLabel: "Cartografía RIDE",
    fecha: "Curso 2024-25",
    src: "assets/images/mapa-recortes-p10.jpg",
    descripcion: "Documentación original de la clasificación de vías en Google Earth (verde, azul, rojo y negro) diseñada por el alumnado de Cultura Europea."
  },
  {
    id: "img-mapa-utrera",
    titulo: "Plano Urbano de Utrera y sus Barrios",
    categoria: "cartografia",
    categoriaLabel: "Referencia Geográfica",
    fecha: "Cartografía Local",
    src: "assets/maps/mapa_osm_utrera.jpg",
    descripcion: "Referencia urbana de Utrera utilizada para coordinar las rutas escolares desde El Junquillo, Renfe, Los Militares, El Arenal y Los Molinos hacia el IES José María Infantes."
  }
];

let currentPhotoIndex = 0;
let currentFilteredList = [...photosData];

export function initGallery() {
  renderGalleryGrid('all');
  setupGalleryFilters();
  setupLightbox();
}

export function renderGalleryGrid(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  currentFilteredList = filter === 'all' 
    ? [...photosData] 
    : photosData.filter(p => p.categoria === filter);

  let html = currentFilteredList.map((item, idx) => `
    <div class="photo-polaroid-card" data-index="${idx}">
      <div class="photo-media-box">
        <img src="${item.src}" alt="${item.titulo}" loading="lazy">
        <span class="photo-badge">${item.categoriaLabel}</span>
      </div>
      <div class="photo-meta">
        <h4 class="photo-title">${item.titulo}</h4>
        <p class="photo-desc">${item.descripcion}</p>
        <div class="photo-footer">
          <span class="photo-date">📅 ${item.fecha}</span>
          <span class="photo-zoom-hint">🔍 Ampliar</span>
        </div>
      </div>
    </div>
  `).join('');

  // Tarjeta Placeholder para próximas actividades
  html += `
    <div class="photo-placeholder-card">
      <div class="placeholder-icon">📸</div>
      <h4 class="placeholder-title">Espacio en Construcción</h4>
      <p class="placeholder-desc">Reservado para las fotografías de las próximas rodadas, salidas rurales y decoración artística del parking con Escuela-Museo.</p>
    </div>
  `;

  grid.innerHTML = html;

  // Clic en polaroid para abrir Lightbox
  grid.querySelectorAll('.photo-polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
  });
}

function setupGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gal-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-gal-filter');
      renderGalleryGrid(cat);
    };
  });
}

function setupLightbox() {
  const lightbox = document.getElementById('modal-lightbox');
  const closeBtn = document.getElementById('lightbox-close');

  if (closeBtn && lightbox) {
    closeBtn.onclick = () => lightbox.classList.add('hidden');
    lightbox.onclick = (e) => {
      if (e.target === lightbox) lightbox.classList.add('hidden');
    };
  }

  // Navegación con teclado
  window.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'Escape') {
      lightbox.classList.add('hidden');
    }
  });
}

function openLightbox(index) {
  if (index < 0 || index >= currentFilteredList.length) return;
  currentPhotoIndex = index;

  const photo = currentFilteredList[currentPhotoIndex];
  const lightbox = document.getElementById('modal-lightbox');
  const img = document.getElementById('lightbox-img');
  const cat = document.getElementById('lightbox-category');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');

  if (!lightbox) return;

  if (img) {
    img.src = photo.src;
    img.alt = photo.titulo;
  }
  if (cat) cat.textContent = `${photo.categoriaLabel} · ${photo.fecha}`;
  if (title) title.textContent = photo.titulo;
  if (desc) desc.textContent = photo.descripcion;

  // Actualizar contador
  const container = lightbox.querySelector('.lightbox-container');
  let counter = container.querySelector('.lightbox-counter');
  if (!counter) {
    const metaTop = container.querySelector('.lightbox-meta-top');
    if (metaTop) {
      counter = document.createElement('span');
      counter.className = 'lightbox-counter';
      metaTop.appendChild(counter);
    }
  }
  if (counter) {
    counter.textContent = `${currentPhotoIndex + 1} de ${currentFilteredList.length}`;
  }

  // Añadir controles de navegación Anterior / Siguiente si no existen
  if (!container.querySelector('.lightbox-prev')) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav-btn lightbox-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.title = 'Foto anterior (Flecha izquierda)';
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav-btn lightbox-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.title = 'Foto siguiente (Flecha derecha)';
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    };

    const mediaWrap = container.querySelector('.lightbox-media-wrap');
    if (mediaWrap) {
      mediaWrap.appendChild(prevBtn);
      mediaWrap.appendChild(nextBtn);
    }
  }

  lightbox.classList.remove('hidden');
}

function navigateLightbox(direction) {
  let newIndex = currentPhotoIndex + direction;
  if (newIndex < 0) newIndex = currentFilteredList.length - 1;
  if (newIndex >= currentFilteredList.length) newIndex = 0;
  openLightbox(newIndex);
}
