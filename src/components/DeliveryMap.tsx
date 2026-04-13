import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { LatLng } from '@/types';

const pinIcon = L.divIcon({
  className: 'alma-leaflet-pin',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:hsl(348,45%,34%);border:3px solid white;box-shadow:0 4px 20px rgba(0,0,0,.35);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface DeliveryMapProps {
  center: LatLng;
  marker: LatLng;
  onMarkerDragEnd: (pos: LatLng) => void;
  mapKey: string;
}

const DeliveryMap = ({ center, marker, onMarkerDragEnd, mapKey }: DeliveryMapProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const position: [number, number] = useMemo(
    () => [marker.lat, marker.lng],
    [marker.lat, marker.lng]
  );

  if (!mounted) {
    return (
      <div className="h-56 md:h-72 w-full rounded-2xl bg-muted/80 animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border shadow-inner"
    >
      <p className="absolute top-3 left-3 z-[500] text-[10px] font-sans tracking-widest uppercase bg-background/90 backdrop-blur px-2 py-1 rounded-full border border-border/60">
        Drag pin to your building
      </p>
      <MapContainer
        key={mapKey}
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom
        className="h-56 md:h-72 w-full z-0 [&_.leaflet-control-attribution]:text-[10px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          draggable
          icon={pinIcon}
          eventHandlers={{
            dragend: (e) => {
              const ll = e.target.getLatLng();
              onMarkerDragEnd({ lat: ll.lat, lng: ll.lng });
            },
          }}
        />
      </MapContainer>
    </motion.div>
  );
};

export default DeliveryMap;
