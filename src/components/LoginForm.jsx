'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (res.error) {
        setError('Niepoprawna nazwa użytkownika lub hasło');
        return;
      }

      router.replace('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-lg p-5 rounded-lg border-t-4 border-green-400'>
        <h1 className='text-xl font-bold my-4'>Zaloguj się</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type='text'
            placeholder='Nazwa użytkownika'
            className='w-[400px] border border-gray-200 py-2 px-3 bg-zinc-100/40 rounded-lg'
          />
          <input
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type='password'
            placeholder='Hasło'
            className='w-[400px] border border-gray-200 py-2 px-3 bg-zinc-100/40 rounded-lg'
          />
          <button className='bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md'>
            Zaloguj się
          </button>
          {error && (
            <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}
          <Link className='text-sm mt-3 text-right' href='/register'>
            Nie masz konta? <span className='underline'>Zarejestruj się</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
