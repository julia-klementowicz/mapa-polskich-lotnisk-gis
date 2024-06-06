import AddComment from '@/components/AddComment';
import { headers } from 'next/headers';
import Header from '@/components/Header';
import Comment from '@/components/Comment';

async function getMarkerById(id) {
  const host = headers().get('host');
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/markerById`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  const { marker } = await res.json();
  return marker;
}

export default async function Comments({ params }) {
  const marker = await getMarkerById(params.id);

  return (
    <>
      <Header />
      <div className='max-w-2xl mx-auto p-6 text-center'>
        <div className='text-center mb-4'>
          <h1 className='font-bold text-xl'>{marker.name}</h1>
          <p>{marker.description}</p>
          <p>Kod ICAO: {marker.ICAO}</p>
          <p className='mb-4'>Roczna liczba pasażerów: {marker.passengers}</p>
          {marker.rateAverage ? (
            <p>Średnia ocena: {marker.rateAverage.toFixed(2)}</p>
          ) : (
            <p>Brak ocen</p>
          )}
        </div>
        <AddComment markerId={params.id} />
        {marker.ratings.reverse().map((rating) => (
          <Comment key={rating._id} comment={rating} />
        ))}
      </div>
    </>
  );
}
