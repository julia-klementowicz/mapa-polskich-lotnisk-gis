export default async function getUserMarkers(username: string) {
  const res = await fetch('api/userMarkers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user markers');
  }

  const data = await res.json();

  return data.markers.markers;
}
