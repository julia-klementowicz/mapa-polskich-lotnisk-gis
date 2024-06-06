'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import MapComponent from './MapComponent';
import Routing from './Routing';
import Loading from './Loading';
// import { markers as defaultMarkers } from '@/data/markers';
import { PiNavigationArrow, PiMagnifyingGlass, PiX } from 'react-icons/pi';
import 'leaflet/dist/leaflet.css';
import MarkerModal from './MarkerModal';
import Link from 'next/link';

function getIcon(color) {
  return new Icon({
    iconUrl: `/location-pin-${color}.png`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

export default function Map() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [destinationPhrase, setDestinationPhrase] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [routingCoords, setRoutingCoords] = useState(null);
  const [defaultMarkers, setDefaultMarkers] = useState([]);
  const [userMarkers, setUserMarkers] = useState([]);
  const [markerModalData, setMarkerModalData] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function getUserMarkers() {
      const res = await fetch('api/userMarkers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: session?.user?.username }),
      });

      const { markers } = await res.json();
      if (markers?.markers.length > 0) {
        setUserMarkers(markers.markers);
      }
    }

    async function getDefaultMarkers() {
      const res = await fetch('api/defaultMarkers');
      const { markers } = await res.json();
      setDefaultMarkers(markers);
      console.log('markers', markers);
    }

    getDefaultMarkers();

    if (session?.user?.username) {
      getUserMarkers();
    }

    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded, session?.user?.username]);

  if (!isLoaded || typeof window === 'undefined') {
    return <Loading />;
  }

  async function handleSearch(e) {
    e.preventDefault();
    // Use geocoding API to get coordinates from search
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${searchPhrase}&key=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const data = await response.json();
    const coordinates = data?.results[0]?.geometry;

    if (coordinates) {
      setSearchResult({
        position: [coordinates.lat, coordinates.lng],
        name: searchPhrase,
        type: 'searchResult',
      });
    } else {
      alert('Nie znaleziono takiej lokalizacji');
    }
  }

  async function handleNavigate(e) {
    e.preventDefault();

    const response1 = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${searchPhrase}&key=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const data1 = await response1.json();
    const fromCoordinates = data1?.results[0]?.geometry;

    const response2 = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${destinationPhrase}&key=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const data2 = await response2.json();
    const toCoordinates = data2?.results[0]?.geometry;

    if (fromCoordinates && toCoordinates) {
      setRoutingCoords({
        from: {
          lat: fromCoordinates.lat,
          lng: fromCoordinates.lng,
        },
        to: {
          lat: toCoordinates.lat,
          lng: toCoordinates.lng,
        },
      });
    } else {
      alert('Nie znaleziono takiej lokalizacji');
    }
  }

  async function handleDeleteMarker(markerId) {
    const res = await fetch('api/deleteMarker', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: session.user.username, markerId }),
    });

    const { message } = await res.json();
    if (message === 'success') {
      setUserMarkers((prev) =>
        prev.filter((marker) => marker._id !== markerId)
      );
    } else {
      alert('Wystąpił błąd');
    }
  }

  return (
    <div className='h-full relative'>
      <form
        style={{ zIndex: 500 }}
        className='absolute top-2 left-2 bg-white p-2 rounded-lg border border-neutral-300 flex flex-col gap-1'
        onSubmit={shouldNavigate ? handleNavigate : handleSearch}
      >
        <div className='flex gap-1'>
          <input
            type='text'
            className='py-1 px-1.5 border border-neutral-300 rounded'
            placeholder={shouldNavigate ? 'Punkt początkowy' : 'Szukaj miejsca'}
            onChange={(e) => {
              setSearchResult(null);
              setSearchPhrase(e.target.value);
            }}
            value={searchPhrase}
          />
          {!shouldNavigate ? (
            <button type='submit'>
              <PiMagnifyingGlass className='w-7 h-7' />
            </button>
          ) : (
            routingCoords && (
              <button type='button' onClick={() => setRoutingCoords(null)}>
                <PiX className='w-7 h-7' />
              </button>
            )
          )}
        </div>
        {shouldNavigate && (
          <div className='flex gap-1'>
            <input
              type='text'
              className='py-1 px-1.5 border border-neutral-300 rounded'
              placeholder='Punkt docelowy'
              onChange={(e) => {
                setSearchResult(null);
                setRoutingCoords(null);
                setDestinationPhrase(e.target.value);
              }}
              value={destinationPhrase}
            />
            <button type='submit'>
              <PiNavigationArrow className='w-7 h-7' />
            </button>
          </div>
        )}
        {shouldNavigate ? (
          <button
            type='button'
            className='text-sm underline'
            onClick={() => setShouldNavigate((prev) => !prev)}
          >
            Szukaj miejsca
          </button>
        ) : (
          <button
            type='button'
            className='text-sm underline'
            onClick={() => setShouldNavigate((prev) => !prev)}
          >
            Znajdź trasę
          </button>
        )}
      </form>
      <div
        style={{ zIndex: 500 }}
        className='absolute bottom-2 left-2 bg-white p-2 rounded-lg border border-neutral-300 flex flex-col gap-1'
      >
        <h2 className='text-center font-semibold'>Legenda</h2>
        <div className='flex'>
          <div className='w-6 h-6 mr-2 bg-red-500 rounded-md'></div>Lotnisko pasażerskie
        </div>
        <div className='flex'>
          <div className='w-6 h-6 mr-2 bg-blue-500 rounded-md'></div>Lotnicza baza wojskowa
        </div>
      </div>
      <MapContainer
        center={[52.3, 19.123]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position='bottomright' />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {defaultMarkers.map((marker, i) => (
          <Marker
            key={i}
            position={marker.position}
            icon={getIcon(marker.color)}
          >
            <Popup>
              <div className='text-center'>
                <h2 className='font-bold'>{marker.name}</h2>
                {marker.ICAO && <p>Kod ICAO: {marker.ICAO}</p>}
                {marker.description && <p>{marker.description}</p>}
                {marker.passengers && (
                  <p>Roczna liczba pasażerów: {marker.passengers}</p>
                )}
                {marker.rateAverage ? (
                  <p>Średnia ocena: {marker.rateAverage}</p>
                ) : (
                  <p>Brak ocen</p>
                )}
                <Link
                  href={`/comments/${marker._id}`}
                  className='p-2 bg-blue-500 rounded-md'
                >
                  <span className='text-white'>Sekcja komentarzy</span>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {userMarkers.map((marker, i) => (
          <Marker
            key={i}
            position={marker.position}
            icon={getIcon(marker.color)}
          >
            <Popup>
              <div className='text-center'>
                <h2 className='font-bold'>{marker.name}</h2>
                {marker.ICAO && <p>Kod ICAO: {marker.ICAO}</p>}
                {marker.description && <p>{marker.description}</p>}
                {marker.passengers && (
                  <p>Roczna liczba pasażerów: {marker.passengers}</p>
                )}
                {session?.user?.username && (
                  <div className='flex justify-around'>
                    <button
                      onClick={() => {
                        setMarkerModalData(marker);
                      }}
                      className='w-20 p-2 bg-sky-500 rounded text-white'
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDeleteMarker(marker._id)}
                      className='w-20 p-2 bg-red-500 rounded text-white'
                    >
                      Usuń
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {searchResult && (
          <Marker position={searchResult.position} icon={getIcon('purple')}>
            <Popup>
              <div className='text-center'>
                <h2 className='font-bold'>{searchResult.name}</h2>
                <p>Wyszukana lokalizacja</p>
                <button
                  onClick={() =>
                    setMarkerModalData({
                      name: searchResult.name,
                      position: searchResult.position,
                      color: 'purple',
                    })
                  }
                  className='w-20 p-2 bg-green-500 rounded text-white'
                >
                  Dodaj
                </button>
              </div>
            </Popup>
          </Marker>
        )}
        <MapComponent marker={searchResult} />
        <Routing
          fromCoordinates={routingCoords?.from ? routingCoords.from : null}
          toCoordinates={routingCoords?.to ? routingCoords.to : null}
        />
      </MapContainer>
      {markerModalData && (
        <MarkerModal
          username={session?.user?.username}
          marker={markerModalData}
          setMarkerModalData={setMarkerModalData}
          setUserMarkers={setUserMarkers}
          setSearchResult={setSearchResult}
        />
      )}
    </div>
  );
}
