export default async function getDefaultMarkers() {
  const res = await fetch('api/defaultMarkers');

  if (!res.ok) {
    throw new Error('Failed to fetch default markers');
  }

  const data = await res.json();
  console.log('default markers data', data);

  return data.markers;
}
