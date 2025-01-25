import AddComment from '@/components/comments/AddComment';
import { headers } from 'next/headers';
import Header from '@/components/layout/Header';
import Comment from '@/components/comments/Comment';

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
          <p>ICAO code: {marker.ICAO}</p>
          <p className='mb-4'>Yearly passengers: {marker.passengers}</p>
          {marker.rateAverage ? (
            <p>Average rating: {marker.rateAverage.toFixed(2)}</p>
          ) : (
            <p>No ratings</p>
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
