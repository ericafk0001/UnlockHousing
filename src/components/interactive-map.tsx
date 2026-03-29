"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  const phillyCenter: [number, number] = [39.9526, -75.1652];

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-border/80 bg-muted/50 will-change-auto">
      <MapContainer
        center={phillyCenter}
        zoom={12}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => onPinClick(listing),
            }}
          >
            <Popup closeButton={true}>
              <div className="min-w-[200px] text-foreground">
                <h3 className="font-semibold text-sm">{listing.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {listing.neighborhood}
                </p>
                <p className="text-lg font-bold mt-1">${listing.rent}/mo</p>
                <p className="text-xs mt-1">
                  {listing.beds === 0 ? "Studio" : `${listing.beds} bd`} •{" "}
                  {listing.baths} ba
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

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
