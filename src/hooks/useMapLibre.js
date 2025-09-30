// src/hooks/useMapLibre.js
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';

export function useMapLibre({
  containerId,              // opzionale se passi containerRef
  containerRef,             // preferibile: usa ref dal componente
  style,
  center = [7.6869, 45.0703],
  zoom = 12,
  controls = { nav: true, fullscreen: true, scale: true },
  onLoad,
  onError,
  hash = false,
  cooperativeGestures = false, // su tablet/trackpad l’utente deve “intenzionalmente” zoomare (tipo ctrl+scroll). È un miglioramento UX quando c’è tanto scroll nella pagina. -> mettere su true se vuoi ABILITARE "use ctrl + scroll to zoom the map
}) {
  const internalRef = useRef(null);
  const ref = containerRef || internalRef;

  const mapRef = useRef(null);          // istanza mappa dentro un “cassetto” che non provoca re-render
  const initializedRef = useRef(false); // guardia StrictMode. In sviluppo, React monta e smonta due volte i componenti per scovare side-effects. Senza protezione, si creerebbero due mappe sovrapposte, due gruppi di controlli, e potenziali memory leak.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // All'inizio dell'effetto aggiungo questo per evitare doppia init in dev (StrictMode) o re-init accidentali. Così, se è già partita un’inizializzazione, la seconda viene ignorata.
    if (initializedRef.current) return;

    const container = ref.current ?? (containerId && document.getElementById(containerId));
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style,
      center,
      zoom,
      hash,
      attributionControl: true,
      cooperativeGestures,
    });

    mapRef.current = map; // mettiamo la mappa nel "cassetto" ma React non rifa il render del componente ogni volta che si cambia, per evitare rallentamenti e loop di render
    initializedRef.current = true;

    const handleLoad = () => {
      // Aggiungi controlli solo quando lo style è pronto
      if (controls?.nav) map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
      if (controls?.fullscreen) map.addControl(new maplibregl.FullscreenControl(), 'top-right');
      if (controls?.scale) map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

      setReady(true); // dà lo stato “mappa pronta”
      map.resize();
      onLoad?.(map);
    };

    const handleError = (e) => onError?.(e);

    map.once('load', handleLoad);
    map.on('error', handleError);

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      map.off('error', handleError);
      map.off('load', handleLoad);
      map.remove();                       // cleanup completo
      mapRef.current = null;
      initializedRef.current = false;     // In cleanup rimetto initializedRef.current = false per permettere un remount pulito quando il componente sparisce e riappare.
      setReady(false);
    };
    // Dipendenze: NON rimontare la mappa per ogni cambio minore.
    // Se vuoi un re-init intenzionale, cambia una chiave (es. "mapKey") e legala qui.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]); // L’effetto dipende solo da [style] (non si rimonta la mappa per ogni sciocchezza)

  // API opzionali, utili per operare sulla mappa senza esporre l'oggetto nudo
  const flyTo = useCallback((opts) => mapRef.current?.flyTo(opts), []);
  const addSource = useCallback((id, source) => {
    const m = mapRef.current; if (!m || m.getSource(id)) return;
    m.addSource(id, source);
  }, []);
  const addLayer = useCallback((layer) => {
    const m = mapRef.current; if (!m || m.getLayer(layer.id)) return;
    m.addLayer(layer);
  }, []);
  const removeLayerAndSource = useCallback((id) => {
    const m = mapRef.current; if (!m) return;
    if (m.getLayer(id)) m.removeLayer(id);
    if (m.getSource(id)) m.removeSource(id);
  }, []);

  // Ritorna il ref (stabile), non il valore .current
  return { mapRef, containerRef: ref, ready, flyTo, addSource, addLayer, removeLayerAndSource };
}
