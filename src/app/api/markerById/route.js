import { connectMongoDB } from '@/lib/mongodb';
import Marker from '@/models/marker';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  try {
    await connectMongoDB();
    const { id } = await req.json();
    const marker = await Marker.findById(id);
    return NextResponse.json({ marker }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
