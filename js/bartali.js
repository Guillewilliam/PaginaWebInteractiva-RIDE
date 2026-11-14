/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   BARTALI.JS — Catálogo y Memoria del Ciclotaller Solidario
   ======================================================== */

let bartaliData = null;

export async function loadBartali() {
  try {
    const res = await fetch('data/bikes_bartali.json');
    bartaliData = await res.json();
    return bartaliData;
  } catch (err) {
    console.error('Error cargando bikes_bartali.json:', err);
    return null;
  }
}

export function renderBartaliShowcase(filterType = 'all') {
  const container = document.getElementById('drawer-content');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerBadge = document.getElementById('drawer-badge');
  const filtersBar = document.getElementById('drawer-filters');

  if (!container || !bartaliData) return;

  if (drawerTitle) drawerTitle.textContent = 'Ciclotaller Solidario Bartali';
  if (drawerBadge) drawerBadge.textContent = 'Economía Circular';
  if (filtersBar) filtersBar.classList.add('hidden');

  const { taller, bicicletas } = bartaliData;

  const filteredBikes = filterType === 'all'
    ? bicicletas
    : bicicletas.filter(b => b.tipo.toLowerCase().includes(filterType.toLowerCase()));

  container.innerHTML = `
    <!-- Ficha Introductiva Gino Bartali -->
    <div class="bartali-intro-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
        <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--ride-yellow); letter-spacing:0.05em;">Homenaje a un Héroe Silencioso</span>
        <span style="font-size:0.8rem;">🇮🇹 🚲</span>
      </div>
      <h3 class="bartali-intro-title">Gino Bartali (1914 - 2000)</h3>
      <p class="bartali-quote">
        «El bien se hace, pero no se dice. Y ciertas medallas se cuelgan en el alma, no en la chaqueta».
      </p>
      <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 0.85rem;">
        ${taller.homenaje} El taller nació tras conocer experiencias europeas en Roma y Soest, transformando un almacén del instituto en un espacio vivo de aprendizaje mecánico, inclusión y economía circular.
      </p>
      <div class="bartali-stats-row">
        <div class="bartali-stat-box">
          <div class="bartali-stat-num">${taller.datos_clave.bicicletas_donadas}+</div>
          <div class="bartali-stat-label">Bicicletas Donadas</div>
        </div>
        <div class="bartali-stat-box">
          <div class="bartali-stat-num">${taller.datos_clave.bicicletas_en_prestamo}</div>
          <div class="bartali-stat-label">Restauradas en Préstamo</div>
        </div>
      </div>
    </div>

    <!-- Barra de Filtros de Bicicletas -->
    <div style="display:flex; gap:0.4rem; overflow-x:auto; padding-bottom:0.4rem; margin-bottom:0.8rem;">
      <button class="filter-chip ${filterType === 'all' ? 'active' : ''}" data-bike-filter="all">Todas (9)</button>
      <button class="filter-chip ${filterType === 'paseo' ? 'active' : ''}" data-bike-filter="paseo">Paseo</button>
      <button class="filter-chip ${filterType === 'montaña' ? 'active' : ''}" data-bike-filter="montaña">Montaña</button>
      <button class="filter-chip ${filterType === 'urbana' ? 'active' : ''}" data-bike-filter="urbana">Urbana</button>
    </div>

    <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
      Bicicletas Bautizadas por «El Pastorcito»:
    </div>

    <!-- Lista de las 9 bicicletas -->
    <div style="display:flex; flex-direction:column; gap:0.85rem;">
      ${filteredBikes.map(bike => `
        <div class="bartali-bike-card" style="border-left-color: ${bike.color_tag};">
          <div class="bike-card-top">
            <span class="bike-num-badge">${bike.nombre}</span>
            <span class="bike-type-pill">${bike.tipo}</span>
          </div>
          <div class="bike-plaque">
            <div class="bike-inscription">«${bike.leyenda}»</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.3rem;">
            <div class="bike-status-row">
              <span style="color:var(--ride-green);">●</span>
              <span>${bike.estado}</span>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted);">Recreos Activos</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="text-align:center; padding:1.25rem 0.5rem; margin-top:1rem; border-top:1px dashed var(--border-light); font-size:0.8rem; color:var(--text-muted);">
      <p><em>«Ya tenemos pensadas nuevas leyendas, pues estamos dispuestos a seguir arreglando bicicletas».</em></p>
      <p style="font-weight:600; color:var(--ride-blue); margin-top:0.2rem;">Memoria de Actividades RIDE</p>
    </div>
  `;

  // Asignar eventos de filtros de bicicletas
  container.querySelectorAll('[data-bike-filter]').forEach(chip => {
    chip.onclick = () => {
      const bFilter = chip.getAttribute('data-bike-filter');
      renderBartaliShowcase(bFilter);
    };
  });
}
