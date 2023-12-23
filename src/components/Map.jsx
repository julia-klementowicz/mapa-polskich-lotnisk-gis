'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { markers } from '@/data/markers';
import MapComponent from './MapComponent';
import Routing from './Routing';

const markerIcons = {
  airport: new Icon({
    iconUrl: '/location-pin-red.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  military: new Icon({
    iconUrl: '/location-pin-blue.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  search: new Icon({
    iconUrl: '/location-pin-purple.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
};

export default function Map() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [destinationPhrase, setDestinationPhrase] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [routingCoords, setRoutingCoords] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  if (!isLoaded || typeof window === 'undefined') {
    return null;
  }

  const handleSearch = async (e) => {
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
  };

  const handleNavigate = async (e) => {
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
      setRoutingCoords([fromCoordinates, toCoordinates]);
      console.log('fromCoordinates', fromCoordinates);
      console.log('toCoordinates', toCoordinates);
    } else {
      alert('Nie znaleziono takiej lokalizacji');
    }
  };

  return (
    <div className='h-full relative'>
      <form
        style={{ zIndex: 1000 }}
        className='absolute top-2 right-2 bg-white p-2 rounded-lg border border-neutral-300 flex flex-col gap-1'
        onSubmit={shouldNavigate ? handleNavigate : handleSearch}
      >
        <div className='flex gap-1'>
          <input
            type='text'
            className='py-1 px-1.5 border border-neutral-300 rounded'
            onChange={(e) => {
              setSearchResult(null);
              setSearchPhrase(e.target.value);
            }}
            value={searchPhrase}
          />
          {!shouldNavigate && (
            <button type='submit'>
              <Image
                src='/search_icon.svg'
                width={28}
                height={28}
                alt='Szukaj'
              />
            </button>
          )}
        </div>
        {shouldNavigate && (
          <div className='flex gap-1'>
            <input
              type='text'
              className='py-1 px-1.5 border border-neutral-300 rounded'
              onChange={(e) => {
                setSearchResult(null);
                setDestinationPhrase(e.target.value);
              }}
              value={destinationPhrase}
            />
            <button type='submit'>
              <Image
                src='/navigation_icon.svg'
                width={28}
                height={28}
                alt='Szukaj'
              />
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
      <MapContainer
        center={[52.3, 19.123]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {markers.map((marker, i) => (
          <Marker
            key={i}
            position={marker.position}
            icon={markerIcons[marker.type]}
          >
            <Popup>
              <div className='text-center'>
                <h2 className='font-bold'>{marker.name}</h2>
                <p>Kod ICAO: {marker.ICAO}</p>
                <p>
                  {marker.type === 'airport'
                    ? 'Lotnisko pasażerskie'
                    : 'Wojskowa baza lotnicza'}
                </p>
                {marker.type === 'airport' && (
                  <p>Liczba pasażerów: {marker.passengers}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {searchResult && (
          <Marker position={searchResult.position} icon={markerIcons.search}>
            <Popup>
              <div className='text-center'>
                <h2 className='font-bold'>{searchResult.name}</h2>
                <p>Wyszukana lokalizacja</p>
              </div>
            </Popup>
          </Marker>
        )}
        <MapComponent marker={searchResult} />
        {routingCoords && (
          <Routing
            fromCoordinates={routingCoords[0]}
            toCoordinates={routingCoords[1]}
          />
        )}
      </MapContainer>
    </div>
  );
}
