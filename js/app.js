/** app.js — Inizializzazione mappa e controlli. **/

const MAPTILER_API_KEY = window.APP_CONFIG?.MAPTILER_API_KEY ?? "";

/**
 * Early-exit: se non c'è la key, avvisa e non procede.
 * Evitiamo side-effects inutili.
 */
if (!MAPTILER_API_KEY) {
  alert("⚠️ API Key MapTiler mancante.\nCopia js/config.example.js in js/config.js e inserisci la tua key.");
} else {
  initMap();
}

/* Inizializzo la mappa di MapLibre */
function initMap() {
  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
    center: [7.6869, 45.0703], // Torino
    zoom: 12,
    attributionControl: true
  });

  // Controlli standard (Navigation, Fullscreen, Geolocate) top-left
  map.addControl(new maplibregl.NavigationControl(), "top-left");
  map.addControl(new maplibregl.FullscreenControl(), "top-left");
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }),
    "top-left"
  );

  // Scala in basso a sinistra
  map.addControl(
    new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
    "bottom-left"
  );
  

  /**
   * Switcher basemap:
   * - UI già presente in index.html, qui leghiamo l’evento.
   * - Sostituiamo il token segnaposto __KEY__ con la key reale al first paint.
   */
  const select = document.getElementById("basemapSelect");
  // Rimpiazza __KEY__ con la key reale per tutte le option
  Array.from(select.options).forEach(opt => {
    opt.value = opt.value.replace("__KEY__", MAPTILER_API_KEY);
  });

  select.addEventListener("change", (e) => {
    const nextStyleUrl = e.target.value;
    map.setStyle(nextStyleUrl);
  });

  // Gestione errori mappa (silenziosa ma utile in debug)
  map.on("error", (e) => {
    console.warn("[MapLibre error]", e && e.error ? e.error : e);
  });
}
