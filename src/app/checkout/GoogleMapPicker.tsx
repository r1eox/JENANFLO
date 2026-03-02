import React, { useState } from "react";

export default function GoogleMapPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google && !map) {
      const gmap = new (window as any).google.maps.Map(document.getElementById("map"), {
        center: { lat: 24.7136, lng: 46.6753 }, // Riyadh center
        zoom: 12,
      });
      gmap.addListener("click", (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        if (marker) marker.setMap(null);
        const newMarker = new (window as any).google.maps.Marker({
          position: { lat, lng },
          map: gmap,
        });
        setMarker(newMarker);
        onLocationSelect(lat, lng);
      });
      setMap(gmap);
    }
  }, [map, marker, onLocationSelect]);

  return (
    <div id="map" style={{ width: "100%", height: 300, borderRadius: 12, marginBottom: 16 }} />
  );
}
