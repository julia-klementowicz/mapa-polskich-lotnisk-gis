'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

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
