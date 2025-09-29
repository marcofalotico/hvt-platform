// src/components/MapComponent.jsx

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapComponent = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets/style.json?key=6S7apkZA3NMOLCjwLecC", // Map style URL
      center: [7.6869, 45.0703], // Longitude, Latitude (example: Torino)
      zoom: 13,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
    map.addControl(new maplibregl.FullscreenControl(), 'top-left');

    return () => map.remove(); // Cleanup on unmount
  }, []);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />;
};

export default MapComponent;
