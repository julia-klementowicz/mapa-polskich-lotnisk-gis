import { headers } from 'next/headers';
import Link from 'next/link';
import Header from '@/components/Header';

async function getMarkers() {
  const host = headers().get('host');
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/defaultMarkers`);
  const { markers } = await res.json();
  return markers;
}

export default async function RankingPage() {
  const markers = await getMarkers();

  return (
    <>
      <Header />
      <div className='max-w-2xl mx-auto p-6 text-center'>
        <h1 className='font-bold text-xl'>Ranking</h1>
        <p>Ranking lotnisk w Polsce</p>
        {markers
          .sort((a, b) => b.rateAverage - a.rateAverage)
          .map((marker) => (
            <Link href={`/comments/${marker._id}`} key={marker._id}>
              <div
                key={marker._id}
                className='border border-gray-300 rounded-lg p-4 my-4'
              >
                <h2 className='font-bold text-lg'>{marker.name}</h2>
                <p>{marker.description}</p>
                <p>Kod ICAO: {marker.ICAO}</p>
                {marker.passengers && (
                  <p>Liczba pasażerów: {marker.passengers}</p>
                )}
                {marker.rateAverage ? (
                  <>
                    <p>Średnia ocena: {marker.rateAverage.toFixed(2)}</p>
                    <p>Liczba ocen: {marker.rateCount}</p>
                  </>
                ) : (
                  <p>Brak ocen</p>
                )}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
