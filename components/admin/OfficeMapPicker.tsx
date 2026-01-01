"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix default marker icon for Leaflet in Next.js
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface OfficeMapPickerProps {
  lat?: number | null;
  lng?: number | null;
  onCoordsChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onCoordsChange }: { onCoordsChange: OfficeMapPickerProps["onCoordsChange"] }) {
  useMapEvents({
    click(e) {
      onCoordsChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function MapUpdater({ lat, lng }: { lat?: number | null; lng?: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  return null;
}

export function OfficeMapPicker({ lat, lng, onCoordsChange }: OfficeMapPickerProps) {
  // Default center: Almaty, Kazakhstan
  const defaultCenter: [number, number] = [43.238949, 76.889709];
  
  const [position, setPosition] = useState<[number, number]>(
    lat && lng ? [lat, lng] : defaultCenter
  );

  // Update position when lat/lng change from outside
  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleMapClick = (newLat: number, newLng: number) => {
    setPosition([newLat, newLng]);
    onCoordsChange(newLat, newLng);
  };

  return (
    <div className="w-full">
      <MapContainer
        center={position}
        zoom={lat && lng ? 15 : 12}
        className="w-full h-[400px] rounded-lg border border-border"
        scrollWheelZoom={true}
        style={{ zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ClickHandler onCoordsChange={handleMapClick} />
        <MapUpdater lat={lat} lng={lng} />

        {position[0] && position[1] && (
          <Marker position={position} icon={markerIcon} />
        )}
      </MapContainer>
      <p className="mt-2 text-sm text-foreground-muted">
        Кликните на карте, чтобы выбрать местоположение офиса, или введите координаты вручную
      </p>
    </div>
  );
}

