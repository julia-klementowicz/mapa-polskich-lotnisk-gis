'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Loading from '../layout/Loading';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
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
        setError('User already exists');
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
        setError('An error occurred during registration');
        return;
      }

      const resSignIn = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (resSignIn.error) {
        setError('Signed up, but could not sign in');
        return;
      }

      router.replace('/');
    } catch (error) {
      console.log('Error during registration: ', error);
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
          <h1 className='text-xl font-bold my-4'>Sign up</h1>
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
          <Input
            required
            variant='bordered'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type='password'
            label='Confirm password'
            className='w-full'
          />
          <Button
            type='submit'
            className='bg-green-600 text-white font-bold cursor-pointer px-6 py-2'
            size='lg'
          >
            Sign up
          </Button>

          {error && (
            <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}

          <Link className='text-sm mt-3 text-right' href='/login'>
            Already have an account? <span className='underline'>Log in</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
