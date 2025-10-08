"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  lat: number;
  lng: number;
  locationName?: string;
}

export function MapView({ lat, lng, locationName }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [lng, lat],
      zoom: 10,
    });

    new maplibregl.Marker({ color: '#3b82f6' })
      .setLngLat([lng, lat])
      .setPopup(
        locationName
          ? new maplibregl.Popup().setHTML(`<strong>${locationName}</strong>`)
          : undefined
      )
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [lat, lng, locationName]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-64 rounded-lg overflow-hidden shadow-md"
    />
  );
}
