import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default function Routing({ fromCoordinates, toCoordinates }) {
  const map = useMap();
  const [routingState, setRoutingState] = useState(null);
  
  useEffect(() => {
    if (routingState) {
      map.removeControl(routingState);
      setRoutingState(null);
    }
    if (!fromCoordinates || !toCoordinates) {
      return;
    }

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
    setRoutingState(routing);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fromCoordinates, toCoordinates]);

  return null;
}
