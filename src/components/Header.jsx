'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PiUserCircleLight } from 'react-icons/pi';
import UserOptions from './UserOptions';

export default function Header() {
  const [userOptions, setUserOptions] = useState(false);
  const { data: session } = useSession();

  return (
    <header className='w-full h-12 px-3 grid grid-cols-5 items-center'>
      <span></span>
      <h1 className='col-span-3 justify-self-center font-bold text-lg sm:text-xl'>
        Mapa polskich lotnisk
      </h1>
      <div className='justify-self-end'>
        {session?.user ? (
          <button
            className='flex items-center gap-1'
            onClick={() => setUserOptions((prev) => !prev)}
          >
            <span className='text-sm sm:text-base'>
              {session.user.username}
            </span>
            <PiUserCircleLight className='w-10 h-10' />
          </button>
        ) : (
          <Link href='/login' className='text-sm sm:text-base'>
            Zaloguj się
          </Link>
        )}
        {userOptions && <UserOptions />}
      </div>
    </header>
  );
}
