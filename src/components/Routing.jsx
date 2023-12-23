import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default function Routing({ fromCoordinates, toCoordinates }) {
  const map = useMap();

  useEffect(() => {
    const markerIcon = new L.Icon({
      iconUrl: '/location-pin-purple.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(fromCoordinates.lat, fromCoordinates.lng),
        L.latLng(toCoordinates.lat, toCoordinates.lng),
      ],
      createMarker: (i, wp) => L.marker(wp.latLng, { icon: markerIcon }),
    }).addTo(map);

    return () => map.removeControl(routing);
  }, [map, fromCoordinates.lat, fromCoordinates.lng, toCoordinates.lat, toCoordinates.lng]);

  return null;
}
