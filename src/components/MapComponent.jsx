// src/components/MapComponent.jsx
import { useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';        // Carica lo stile base di MapLibre
import { useMapLibre } from '../hooks/useMapLibre';

// Sceglie lo style: se c'è la key di MapTiler usa quello, altrimenti fallback demo.
// In futuro: sostituire con uno style self-hosted o uno stile custom.
const key = import.meta.env.VITE_MAPTILER_KEY;
const styleUrl = key
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`
  : 'https://demotiles.maplibre.org/style.json';

export default function MapComponent() {
  // Ref del DIV che conterrà la mappa.
  // In futuro: questo ref può essere passato a una Sidebar che misura dimensioni per layout responsive.
  const containerRef = useRef(null);

  // Hook che monta la mappa e restituisce stato + piccole API.
  // In futuro: leggere mapRef.current per operazioni avanzate, oppure usare addSource/addLayer/flyTo.
  const { ready, addSource, addLayer } = useMapLibre({
    containerRef,
    style: styleUrl,
    center: [7.6869, 45.0703], // Torino
    zoom: 12,
    controls: { nav: true, fullscreen: true, scale: true },
    cooperativeGestures: false,

    // Callback quando lo style è caricato.
    // In futuro: qui si centralizzano sorgenti/layer iniziali, listener, e logiche di avvio.
    onLoad: (map) => {
      // Ad esempio: aggiungere una source/layer.
      // addSource('example-src', { type: 'geojson', data: { type:'FeatureCollection', features: [] } });
      // addLayer({ id: 'example-lyr', type: 'circle', source: 'example-src', paint: { 'circle-radius': 4 } });

      // In futuro: si possono collegare eventi:
      // map.on('click', 'example-lyr', (e) => { /* aprire popup o pannelli info */ });
    },

    // In futuro: qui si possono intercettare errori di rete/style per log e retry.
    onError: (e) => console.warn('[Map error]', e),
  });

  return (
    // Contenitore a piena altezza/larghezza: la classe .map-container è definita in src/index.css
    // In futuro: si può avvolgere la mappa con header/sidebar/pannelli flottanti.
    <div className="map-container" style={{ position: 'relative' }}>
      {/* Div target della mappa. In futuro: si può cambiare stile inline in favore di una classe dedicata. */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Overlay di caricamento: appare finché la mappa non è pronta.
          In futuro: sostituire con un Loader component condiviso (spinner, skeleton, ecc.). */}
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
            fontFamily: 'system-ui',
            fontSize: 14,
          }}
        >
          Caricamento mappa…
        </div>
      )}
    </div>
  );
}
