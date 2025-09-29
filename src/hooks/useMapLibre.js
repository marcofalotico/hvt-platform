// src/hooks/useMapLibre.js
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

export function useMapLibre({
  containerId,            // opzionale se usi ref
  containerRef,           // preferibile: passaci un ref
  style,
  center = [7.6869, 45.0703],
  zoom = 12,
  controls = { nav: true, fullscreen: true, scale: true },
  onLoad,                 // callback quando la mappa è pronta
  onError,                // callback errori
  hash = false,
  cooperativeGestures = false // UX migliore su tablet -> metti su true se vuoi ABILITARE "use ctrl + scroll to zoom the map
}) {
  const internalRef = useRef(null);
  const ref = containerRef || internalRef;
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = ref.current ?? (containerId && document.getElementById(containerId));
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style,
      center,
      zoom,
      hash,
      attributionControl: true,
      cooperativeGestures
    });
    mapRef.current = map;

    const handleLoad = () => { setReady(true); onLoad?.(map); };
    const handleError = (e) => { onError?.(e); };

    map.once('load', handleLoad);
    map.on('error', handleError);

    if (controls?.nav) map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    if (controls?.fullscreen) map.addControl(new maplibregl.FullscreenControl(), 'top-right');
    if (controls?.scale) map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      map.off('error', handleError);
      map.off('load', handleLoad);
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, center[0], center[1], zoom, hash, cooperativeGestures, controls?.nav, controls?.fullscreen, controls?.scale]);

  return { map: mapRef.current, containerRef: ref, ready };
}
