'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Slider } from '@heroui/slider';
import { Button } from '@heroui/button';

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
          <h2>Add a comment and rating</h2>
          <textarea
            className='w-full p-2 border border-gray-300 rounded-xl'
            placeholder='Comment'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <Slider
            minValue={1}
            maxValue={5}
            step={0.5}
            className='w-full'
            onChange={(value: number) => setRating(value)}
            value={rating}
          />
          <p>Rating: {rating}</p>
          <Button
            className='bg-blue-500 text-white p-2 w-full mt-4'
            type='submit'
          >
            Submit
          </Button>
        </form>
      ) : (
        <p>You have to be logged in to comment</p>
      )}
    </div>
  );
}
