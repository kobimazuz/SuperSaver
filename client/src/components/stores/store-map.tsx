import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Store } from "@shared/schema";

interface StoreMapProps {
  stores: Store[];
  onStoreSelect?: (store: Store) => void;
}

export default function StoreMap({ stores, onStoreSelect }: StoreMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView([31.7683, 35.2137], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Add markers for stores
    stores.forEach(store => {
      const marker = L.marker([parseFloat(store.lat), parseFloat(store.lng)])
        .addTo(mapRef.current!);

      if (onStoreSelect) {
        marker.on('click', () => onStoreSelect(store));
      }

      marker.bindPopup(`
        <strong>${store.name}</strong><br>
        ${store.address}
      `);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [stores, onStoreSelect]);

  return (
    <div ref={mapContainerRef} className="h-[50vh] w-full rounded-lg" />
  );
}
