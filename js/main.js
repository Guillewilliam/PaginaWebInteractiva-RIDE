/**
 * Punto de entrada principal como ES Module para Proyecto RIDE
 */
import { RideActivities } from './activities.js';
import { RideNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', async () => {
  await RideActivities.loadActivities();
  RideNavigation.init();
});