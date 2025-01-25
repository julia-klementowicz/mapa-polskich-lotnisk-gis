'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Loading from '@/components/layout/Loading';
const Map = dynamic(() => import('@/components/map/Map'), { ssr: false });

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  if (!isLoaded || typeof window === 'undefined') {
    return <Loading />;
  }

  return (
    <main className='w-full h-screen flex flex-col'>
      <Header />
      <Map />
    </main>
  );
}
