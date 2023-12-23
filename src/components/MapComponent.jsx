import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapComponent({ marker }) {
  const map = useMap();

  useEffect(() => {
    if (marker) {
      map.flyTo(marker.position, 12);
    } else {
      map.flyTo([52.3, 19.123], 7);
    }
  }, [marker, map]);

  return null;
}
