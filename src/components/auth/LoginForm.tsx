'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../layout/Loading';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (res.error) {
        setError('Invalid username or password');
        return;
      }

      router.replace('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='grid place-items-center h-screen'>
      {isLoading && <Loading />}
      <div className='w-full sm:max-w-[500px]'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-3 shadow-lg m-4 p-5 rounded-xl border-t-4 border-green-400'
        >
          <h1 className='text-xl font-bold my-4'>Log in</h1>
          <Input
            required
            variant='bordered'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type='text'
            label='Username'
            className='w-full'
          />
          <Input
            required
            variant='bordered'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            label='Password'
            className='w-full'
          />
          <Button
            type='submit'
            className='bg-green-600 text-white font-bold px-6 py-2'
            size='lg'
          >
            Log in
          </Button>
          {error && (
            <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}
          <Link className='text-sm mt-3 text-right' href='/register'>
            No account? <span className='underline'>Sign up</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
