export default function Comment({ comment }) {
  const date = new Date(comment.createdAt);
  return (
    <article className='flex flex-col gap-3 my-3 p-6 text-base bg-white rounded-lg border border-gray-300'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <p className='inline-flex items-center mr-3 text-sm text-gray-900 font-semibold'>
            {comment.username}
          </p>
          <p className='text-sm text-gray-600'>
            <time pubdate='' dateTime='2022-02-08' title='February 8th, 2022'>
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </time>
          </p>
        </div>
      </div>
      <p className='text-justify text-gray-500'>
        Ocena: {comment.rate.toFixed(2)}
      </p>
      <p className='text-gray-500 text-justify'>{comment.comment}</p>
    </article>
  );
}
