import Link from 'next/link';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  return (
    <main className='w-full h-screen flex flex-col'>
      <header className='w-full h-12 px-3 grid grid-cols-5 items-center'>
        <span />
        <h1 className='col-span-3 justify-self-center font-bold text-lg sm:text-xl'>
          Mapa polskich lotnisk
        </h1>
        <div className='justify-self-end'>
          <Link href='/login' className='text-sm'>
            Zaloguj się
          </Link>
        </div>
      </header>
      <Map />
    </main>
  );
}
