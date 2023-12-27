import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { PiSignOut, PiMapPin } from 'react-icons/pi';

export default function UserOptions() {
  return (
    <div
      className='fixed top-[50px] right-1 bg-white p-2 rounded-lg border border-neutral-300'
      style={{ zIndex: 650 }}
    >
      {/* <Link
        href='/markers'
        className='w-full text-sm py-2 pl-2 pr-4 hover:bg-neutral-100 rounded-md flex items-center'
      >
        <PiMapPin className='w-5 h-5 mr-2' />
        <span>Moje markery</span>
      </Link> */}
      <button
        onClick={signOut}
        className='w-full text-sm py-2 pl-2 pr-4 hover:bg-neutral-100 rounded-md flex items-center'
      >
        <PiSignOut className='w-5 h-5 mr-2' />
        <span>Wyloguj się</span>
      </button>
    </div>
  );
}
