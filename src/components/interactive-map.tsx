"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Listing = {
  id: number;
  title: string;
  neighborhood: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  supportNote: string;
  lat: number;
  lng: number;
  imageUrl: string;
};

interface InteractiveMapProps {
  listings: Listing[];
  onPinClick: (listing: Listing) => void;
}

// Custom icon for listing pins
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-rose-800 bg-rose-700 text-white text-xs font-bold shadow-lg">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function InteractiveMap({
  listings,
  onPinClick,
}: InteractiveMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Fix for Leaflet icon issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapElementRef.current, {
      center: [39.9526, -75.1652],
      zoom: 12,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      preferCanvas: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      crossOrigin: true,
      updateWhenIdle: true,
      keepBuffer: 3,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      markersLayerRef.current?.clearLayers();
      markersLayerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) {
      return;
    }

    layer.clearLayers();

    const bounds = L.latLngBounds([]);

    listings.forEach((listing) => {
      const marker = L.marker([listing.lat, listing.lng], {
        icon: createCustomIcon(),
        keyboard: true,
        riseOnHover: true,
      });

      marker.bindPopup(
        `<div style="min-width:200px;color:#111827">
          <h3 style="font-weight:600;font-size:0.875rem;line-height:1.25rem;">${listing.title}</h3>
          <p style="font-size:0.75rem;line-height:1rem;color:#6b7280;">${listing.neighborhood}</p>
          <p style="font-size:1.125rem;line-height:1.75rem;font-weight:700;margin-top:0.25rem;">$${listing.rent}/mo</p>
          <p style="font-size:0.75rem;line-height:1rem;margin-top:0.25rem;">${listing.beds === 0 ? "Studio" : `${listing.beds} bd`} • ${listing.baths} ba</p>
        </div>`,
      );

      marker.on("click", () => onPinClick(listing));
      marker.addTo(layer);
      bounds.extend([listing.lat, listing.lng]);
    });

    if (listings.length > 0) {
      map.fitBounds(bounds.pad(0.18), {
        animate: false,
      });
    }
  }, [listings, onPinClick]);

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-border/80 bg-muted/50 will-change-auto">
      <div ref={mapElementRef} className="h-full w-full" />

      <div className="absolute left-3 top-3 rounded-lg border border-border/80 bg-background/95 px-3 py-2 shadow-sm pointer-events-none z-10">
        <p className="text-xs font-medium text-muted-foreground">
          {listings.length} listings in Philadelphia
        </p>
        <p className="text-sm font-semibold text-foreground">
          Click pins to view details
        </p>
      </div>
    </div>
  );
}
