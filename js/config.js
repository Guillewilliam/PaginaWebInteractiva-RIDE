/* ========================================================
   PROYECTO RIDE — PONTE EN MARCHA | IES JOSÉ MARÍA INFANTES
   CONFIG.JS — Configuración de APIs, Capas y Claves
   ======================================================== */

export const CONFIG = {
  // Configuración de la API de CARTO
  carto: {
    apiKey: 'cb1_58wn_1_c194f2fa5c2589a8a6874685',
    // URL oficial autenticada con soporte para pantallas Retina ({r}) y subdominios
    voyagerRasterUrl: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_58wn_1_c194f2fa5c2589a8a6874685',
    vectorStyleUrl: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=cb1_58wn_1_c194f2fa5c2589a8a6874685',
    // Servidor de respaldo automático (OpenStreetMap) en caso de caída o cuota
    fallbackUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  },

  // Capa Aérea Satelital (Esri World Imagery)
  esri: {
    satelliteUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imágenes satélite &copy; Esri, Maxar, Earthstar Geographics'
  },

  // Coordenadas fijas de referencia en Utrera
  coords: {
    iesInfantes: [37.18347, -5.77160],
    ayuntamiento: [37.18182, -5.78045],
    consolacion: [37.18950, -5.76120]
  }
};

