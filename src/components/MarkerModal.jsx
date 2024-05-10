import Image from 'next/image';
import { useState } from 'react';
import mongoose from 'mongoose';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { PiX } from 'react-icons/pi';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

export default function MarkerModal({
  username,
  marker,
  setMarkerModalData,
  setUserMarkers,
  setSearchResult,
}) {
  const [name, setName] = useState(marker?.name || '');
  const [ICAO, setICAO] = useState(marker?.ICAO || '');
  const [passengers, setPassengers] = useState(marker?.passengers || '');
  const [description, setDescription] = useState(marker?.description || '');
  const [lat, setLat] = useState(marker?.position[0] || '');
  const [lng, setLng] = useState(marker?.position[1] || '');
  const [color, setColor] = useState(marker?.color || 'red');

  async function handleSubmit(e) {
    e.preventDefault();

    const newMarker = {
      _id: marker?._id || new mongoose.Types.ObjectId(),
      name,
      ...(marker?.ICAO && { ICAO }),
      ...(marker?.passengers && { passengers }),
      ...(description && { description }),
      position: [lat, lng],
      color,
    };

    if (marker?._id) {
      try {
        const editRes = await fetch('/api/editMarker', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, markerId: marker._id, newMarker }),
        });
        const { message } = await editRes.json();
        if (message === 'success') {
          setUserMarkers((prev) =>
            prev.map((m) => (m._id === marker._id ? newMarker : m))
          );
          setSearchResult(null);
          setMarkerModalData(null);
        } else {
          alert('Wystąpił błąd');
        }
      } catch (error) {
        alert('Wystąpił błąd');
      }
    } else {
      try {
        const addRes = await fetch('/api/addMarker', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, newMarker }),
        });

        const { message } = await addRes.json();
        if (message === 'success') {
          setUserMarkers((prev) => [...prev, newMarker]);
          setSearchResult(null);
          setMarkerModalData(null);
        } else {
          alert('Wystąpił błąd');
        }
      } catch (error) {
        alert('Wystąpił błąd');
      }
    }
  }

  return (
    <div
      className='fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center'
      style={{ zIndex: 700 }}
    >
      <div className='max-w-[500px] bg-white m-4 p-4 rounded-lg'>
        <div className='mb-4 w-full grid grid-cols-3 items-center'>
          <span />
          <h2 className='font-bold text-base sm:text-lg justify-self-center'>
            {marker?._id ? 'Edytuj' : 'Dodaj'} marker
          </h2>
          <button
            onClick={() => setMarkerModalData(null)}
            className='justify-self-end'
          >
            <PiX className='w-8 h-8' />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-2 text-sm sm:text-base'
        >
          <input
            type='text'
            className='border border-neutral-200 rounded-md p-2'
            placeholder='Nazwa'
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          {marker?.ICAO && (
            <input
              type='text'
              className='border border-neutral-200 rounded-md p-2'
              placeholder='Kod ICAO'
              onChange={(e) => setICAO(e.target.value)}
              value={ICAO}
            />
          )}
          {marker?.passengers && (
            <input
              type='text'
              className='border border-neutral-200 rounded-md p-2'
              placeholder='Liczba pasażerów'
              onChange={(e) => setPassengers(e.target.value)}
              value={passengers}
            />
          )}
          <input
            type='text'
            className='border border-neutral-200 rounded-md p-2'
            placeholder='Opis'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <div className='grid grid-cols-2 gap-2'>
            <input
              type='number'
              className='border border-neutral-200 rounded-md p-2'
              placeholder='Szerokość geograficzna'
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              required
            />
            <input
              type='number'
              className='border border-neutral-200 rounded-md p-2'
              placeholder='Długość geograficzna'
              onChange={(e) => setLng(e.target.value)}
              value={lng}
              required
            />
          </div>
          <div className='grid grid-cols-7 justify-items-center gap-0.5'>
            {colors.map((clr) => (
              <button
                type='button'
                key={clr}
                onClick={() => setColor(clr)}
                className={`relative border ${
                  clr === color ? 'border-black' : 'border-gray-200'
                }  rounded-lg p-1`}
              >
                {clr === color && (
                  <IoIosCheckmarkCircle className='absolute -top-1.5 -left-1.5 w-5 h-5' />
                )}
                <Image
                  src={`/location-pin-${clr}.png`}
                  width={50}
                  height={50}
                  alt={clr}
                />
              </button>
            ))}
          </div>
          <button className='mt-2 bg-green-500 text-white py-2 rounded-md'>
            Zapisz
          </button>
        </form>
      </div>
    </div>
  );
}
