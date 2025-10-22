/**
 * * app.js — Template base WEBGIS (MapLibre + MapTiler)
 * * - Basemap: OSM MapTiler
 * * - Centro: Torino
 * * - Controlli standard + geocoding
 * */
const MAPTILER_API_KEY = window.APP_CONFIG?.MAPTILER_API_KEY ?? "";
if (!MAPTILER_API_KEY) {
  alert("⚠️ API Key MapTiler mancante.\nAggiungila in js/config.js.");
} else {
  initMap();
}

function initMap() {
  const map = new maplibregl.Map({
    container: "map",
    style:
      `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
    center: [7.6869, 45.0703], // Torino
    zoom: 12,
    attributionControl: false,
  });
  // Controlli standard
  map.addControl(new maplibregl.NavigationControl(), "top-left");
  map.addControl(new maplibregl.FullscreenControl(), "top-left");
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    }),
    "top-left"
  );
  map.addControl(
    new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
    "bottom-left"
  );
  map.addControl(
    new maplibregl.AttributionControl({
      compact: true,
      customAttribution:
        'Basemap © <a href="https://www.maptiler.com/" target="_blank" rel="noopener">MapTiler</a>, © OpenStreetMap contributors',
    }),
    "bottom-right"
  );
  /* Scelta Basemap */ 
  document.getElementById("basemapSelect")
    .addEventListener("change", function () {
      map.setStyle(this.value);
    });
  map.on("error", (e) => {
    console.warn("[MapLibre error]", e);
  });
}
