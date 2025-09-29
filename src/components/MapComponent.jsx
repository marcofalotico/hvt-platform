import { useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapLibre } from '../hooks/useMapLibre';

const key = import.meta.env.VITE_MAPTILER_KEY;
const styleUrl = key
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`
  : 'https://demotiles.maplibre.org/style.json';

export default function MapComponent() {
  const ref = useRef(null);
  const { ready } = useMapLibre({
    containerRef: ref,
    style: styleUrl,
    onLoad: (map) => {
      // Esempio: aggiungi qui sources/layers/event listeners in un unico posto
      // map.addSource(...); map.addLayer(...);
    },
    onError: (e) => console.warn('[Map error]', e)
  });

  return (
    <div className="map-container" style={{ position:'relative' }}>
      <div ref={ref} style={{ width:'100%', height:'100%' }} />
      {!ready && <div style={{
        position:'absolute', inset:0, display:'grid', placeItems:'center',
        pointerEvents:'none', fontFamily:'system-ui', fontSize:14
      }}>Caricamento mappa…</div>}
    </div>
  );
}
