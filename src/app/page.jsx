import Link from 'next/link';
import Map from '@/components/Map';

export default function Home() {
  return (
    <main className='w-full h-screen flex flex-col'>
      <header className='w-full h-12 px-3 grid grid-cols-5 items-center'>
        <div></div>
        <h1 className='col-span-3 justify-self-center font-bold text-xl'>
          Mapa polskich lotnisk
        </h1>
        <div className='justify-self-end'>
          <Link href='/login'>Zaloguj się</Link>
        </div>
      </header>
      <Map />
    </main>
  );
}
