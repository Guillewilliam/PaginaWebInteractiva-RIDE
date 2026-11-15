/**
 * Punto de entrada protegido para Proyecto RIDE:
 * Garantiza el renderizado de los 13 banners incluso si otro script lanza un error.
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (typeof RideActivities !== 'undefined') {
      await RideActivities.loadActivities();
    }
  } catch (error) {
    console.error('Error cargando actividades:', error);
  }

  try {
    if (typeof RideNavigation !== 'undefined') {
      RideNavigation.init();
    }
  } catch (error) {
    console.error('Error inicializando navegación:', error);
  }

  try {
    if (typeof initRideMap === 'function') {
      initRideMap();
    }
  } catch (error) {
    console.warn('Aviso al inicializar el mapa en segundo plano:', error);
  }
});