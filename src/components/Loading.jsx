'use client';

export default function Loading() {
  return (
    <div className='fixed flex h-screen w-full items-center justify-center bg-white bg-opacity-50'>
      <span
        className='text-primary inline-block h-12 w-12 rounded-full border-[5px] border-solid border-current border-r-transparent align-[-0.125em]'
        style={{ animation: 'rotation 0.7s linear infinite' }}
      />
    </div>
  );
}
