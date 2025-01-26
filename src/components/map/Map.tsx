'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useSWR from 'swr';
import Loading from '../layout/Loading';
import getUserMarkers from '@/lib/getUserMarkers';
import getDefaultMarkers from '@/lib/getDefaultMarkers';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapComponent from './MapComponent';
import MarkerModal from './MarkerModal';
import Routing from './Routing';
import { Button } from '@heroui/button';
import { PiNavigationArrow, PiMagnifyingGlass, PiX } from 'react-icons/pi';

function getIcon(color) {
  return new Icon({
    iconUrl: `/location-pin-${color}.svg`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

export default function Map() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [destinationPhrase, setDestinationPhrase] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [routingCoords, setRoutingCoords] = useState(null);
  const [markerModalData, setMarkerModalData] = useState(null);
  const { data: session } = useSession();

  const {
    data: defaultMarkersData,
    isLoading: isDefaultMarkersDataLoading,
    error: defaultMarkersDataError,
  } = useSWR('api/defaultMarkers', () => getDefaultMarkers());

  const {
    data: userMarkersData,
    isLoading: isUserMarkersDataLoading,
    error: userMarkersDataError,
    mutate: setUserMarkers,
  } = useSWR(session?.user?.username ? 'api/userMarkers' : null, () =>
    getUserMarkers(session?.user?.username)
  );

  if (
    isDefaultMarkersDataLoading ||
    isUserMarkersDataLoading ||
    typeof window === 'undefined'
  ) {
    return <Loading />;
  }

  if (defaultMarkersDataError || userMarkersDataError) {
    return <div>An error occurred</div>;
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
      alert('Could not find location');
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
      alert('Could not find location');
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
      alert('An error occurred');
    }
  }

  return (
    <div className='h-full relative'>
      <form
        style={{ zIndex: 500 }}
        className='absolute top-2 left-2 bg-white p-3 rounded-xl border border-neutral-300 flex flex-col gap-1'
        onSubmit={shouldNavigate ? handleNavigate : handleSearch}
      >
        <div className='flex gap-1'>
          <input
            type='text'
            className='py-1 px-1.5 border border-neutral-300 rounded'
            placeholder={shouldNavigate ? 'Starting point' : 'Find location'}
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
              placeholder='Destination point'
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
            Find location
          </button>
        ) : (
          <button
            type='button'
            className='text-sm underline'
            onClick={() => setShouldNavigate((prev) => !prev)}
          >
            Find a route
          </button>
        )}
      </form>
      <div
        style={{ zIndex: 500 }}
        className='absolute bottom-2 left-2 bg-white p-3 rounded-xl border border-neutral-300 flex flex-col gap-1'
      >
        <h2 className='text-center font-semibold'>Key</h2>
        <div className='flex'>
          <div className='w-6 h-6 mr-2 bg-red-500 rounded-md'></div>
          Civil aviation airport
        </div>
        <div className='flex'>
          <div className='w-6 h-6 mr-2 bg-blue-500 rounded-md'></div>
          Military airport
        </div>
      </div>
      <MapContainer
        // @ts-ignore
        center={[52.3, 19.123]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position='bottomright' />
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        {defaultMarkersData &&
          defaultMarkersData.map((marker, i) => (
            <Marker
              key={i}
              position={marker.position}
              // @ts-ignore
              icon={getIcon(marker.color)}
            >
              <Popup>
                <div className='text-center'>
                  <h2 className='font-bold'>{marker.name}</h2>
                  {marker.ICAO && <p>ICAO code: {marker.ICAO}</p>}
                  {marker.description && <p>{marker.description}</p>}
                  {marker.passengers && (
                    <p>Yearly passengers: {marker.passengers}</p>
                  )}
                  {marker.rateAverage ? (
                    <p>Average rating: {marker.rateAverage}</p>
                  ) : (
                    <p>No ratings</p>
                  )}
                  <Button
                    as={Link}
                    href={`/comments/${marker._id}`}
                    className='bg-blue-500'
                    radius='sm'
                  >
                    <span className='text-white'>Comment section</span>
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        {userMarkersData &&
          userMarkersData.map((marker, i) => (
            <Marker
              key={i}
              position={marker.position}
              // @ts-ignore
              icon={getIcon(marker.color)}
            >
              <Popup>
                <div className='text-center'>
                  <h2 className='font-bold'>{marker.name}</h2>
                  {marker.ICAO && <p>ICAO code: {marker.ICAO}</p>}
                  {marker.description && <p>{marker.description}</p>}
                  {marker.passengers && (
                    <p>Yearly passengers: {marker.passengers}</p>
                  )}
                  {session?.user?.username && (
                    <div className='flex gap-2 justify-around'>
                      <Button
                        onPress={() => {
                          setMarkerModalData(marker);
                        }}
                        className='w-20 bg-sky-500 text-white'
                        radius='sm'
                      >
                        Edit
                      </Button>
                      <Button
                        onPress={() => handleDeleteMarker(marker._id)}
                        className='w-20 bg-red-500 text-white'
                        radius='sm'
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        {searchResult && (
          // @ts-ignore
          <Marker position={searchResult.position} icon={getIcon('purple')}>
            <Popup>
              <div className='text-center'>
                <h2 className='font-bold'>{searchResult.name}</h2>
                <p>Search result</p>
                <Button
                  onPress={() =>
                    setMarkerModalData({
                      name: searchResult.name,
                      position: searchResult.position,
                      color: 'purple',
                    })
                  }
                  className='w-20 bg-green-500 text-white'
                  radius='sm'
                >
                  Add
                </Button>
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
