'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AddComment({ markerId }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);
  const { data: session } = useSession();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log({
      username: session?.user?.username,
      comment,
      rate: Number(rating),
      markerId,
    });
    const addComment = await fetch('/api/addRating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: session?.user?.username,
        comment,
        rate: rating,
        markerId,
      }),
    });
    const { message } = await addComment.json();
    console.log('message', message);
    location.reload();
  }

  return (
    <div className='mx-auto max-w-[500px] flex flex-col justify-center items-center'>
      {session?.user?.username ? (
        <form onSubmit={handleSubmit}>
          <h2>Dodaj komentarz i ocenę</h2>
          <textarea
            className='w-full p-2 border border-gray-300 rounded-lg'
            placeholder='Treść komentarza'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <input
            type='range'
            min={1}
            max={5}
            step={0.5}
            className='w-full'
            onChange={(e) => setRating(e.target.value)}
            value={rating}
          />
          <p>Ocena: {rating}</p>
          <button
            className='bg-blue-500 text-white p-2 rounded-lg w-full mt-4'
            type='submit'
          >
            Dodaj
          </button>
        </form>
      ) : (
        <p>Musisz być zalogowany żeby dodać komentarz</p>
      )}
    </div>
  );
}
