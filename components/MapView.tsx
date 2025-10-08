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
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Clean up previous map if it exists
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Initialize map
    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [lng, lat],
        zoom: 10,
      });

      // Add marker
      markerRef.current = new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat([lng, lat]);

      if (locationName) {
        markerRef.current.setPopup(
          new maplibregl.Popup().setHTML(`<strong>${locationName}</strong>`)
        );
      }

      markerRef.current.addTo(map.current);

    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      markerRef.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, [lat, lng, locationName]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-64 rounded-lg overflow-hidden shadow-md"
      style={{ minHeight: '256px' }}
    />
  );
}
