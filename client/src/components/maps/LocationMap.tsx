import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HistoricalSite } from '@shared/schema';

// Default icon URLs (Leaflet has issues with webpack assets)
const DEFAULT_ICON_URL = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const DEFAULT_SHADOW_URL = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: DEFAULT_ICON_URL,
  shadowUrl: DEFAULT_SHADOW_URL,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationMapProps {
  sites: HistoricalSite[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Component to handle user location updates
function LocationMarker() {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 5 });
    
    map.on('locationfound', (e) => {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, 5);
    });

    map.on('locationerror', (e) => {
      console.error(e.message);
      setLocationError("Couldn't get your location. Using default view.");
      // Use a default location if user's location can't be determined
      map.setView([0, 0], 2);
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map]);

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={defaultIcon}>
      <Popup>You are here</Popup>
    </Marker>
  ) : locationError ? (
    <div className="absolute top-4 right-4 bg-destructive text-white p-2 rounded-md">
      {locationError}
    </div>
  ) : null;
}

// Main map component
export function LocationMap({ sites }: LocationMapProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Calculate distances to sites if user location is available
  const sitesWithDistance = sites.map(site => {
    const coords = site.coordinates as Coordinates;
    let distance = null;
    
    if (userLocation) {
      distance = calculateDistance(userLocation, coords);
    }
    
    return {
      ...site,
      distance
    };
  });

  return (
    <div className="w-full h-[500px] relative">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker />
        
        {sitesWithDistance.map((site) => {
          const coords = site.coordinates as Coordinates;
          return (
            <Marker 
              key={site.id} 
              position={[coords.lat, coords.lng]} 
              icon={defaultIcon}
            >
              <Popup>
                <div className="font-bold">{site.name}</div>
                <div>{site.location}</div>
                {site.distance && (
                  <div className="mt-2">
                    <span className="font-semibold">Distance from you:</span>
                    <span className="ml-2">{site.distance.toFixed(2)} km</span>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
