"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

interface MapPickerProps {
  value: { lat?: number; lng?: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}

function ClickHandler({ onChange }: { onChange: MapPickerProps["onChange"] }) {
  useMapEvents({
    click(e) {
      onChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>(
    value.lat && value.lng
      ? [value.lat, value.lng]
      : [43.238949, 76.889709] // fallback — Алматы
  );

  // автоцентр по геолокации
  useEffect(() => {
    if (value.lat && value.lng) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude] as [number, number];
        setPosition(p);
        onChange({ lat: p[0], lng: p[1] });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={14}
      className="w-full h-[320px] rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      <ClickHandler onChange={onChange} />

      {value.lat && value.lng && (
        <Marker position={[value.lat, value.lng]} icon={markerIcon} />
      )}
    </MapContainer>
  );
}
