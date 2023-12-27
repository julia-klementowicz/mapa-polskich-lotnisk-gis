'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Wszystkie pola są wymagane');
      return;
    }

    try {
      const resUserExists = await fetch('api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const { userExists } = await resUserExists.json();

      if (userExists) {
        setError('Nazwa użytkownika jest już zajęta');
        return;
      }

      const res = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        setError('Wystąpił błąd podczas rejestracji');
        return;
      }

      const resSignIn = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (resSignIn.error) {
        setError('Zarejestrowano, ale nie udało się zalogować');
        return;
      }

      router.replace('/');
    } catch (error) {
      console.log('Error during registration: ', error);
    }
  };

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-lg p-5 rounded-lg border-t-4 border-green-400'>
        <h1 className='text-xl font-bold my-4'>Zarejestruj się</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            required
            onChange={(e) => setUsername(e.target.value)}
            type='text'
            placeholder='Nazwa użytkownika'
            className='w-[400px] border border-gray-200 py-2 px-3 bg-zinc-100/40 rounded-lg'
          />
          <input
            required
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='Hasło'
            className='w-[400px] border border-gray-200 py-2 px-3 bg-zinc-100/40 rounded-lg'
          />
          <button className='bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md'>
            Załóż konto
          </button>

          {error && (
            <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}

          <Link className='text-sm mt-3 text-right' href='/login'>
            Masz już konto? <span className='underline'>Zaloguj się</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
