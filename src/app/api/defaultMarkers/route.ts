import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import Marker from '@/models/marker';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  try {
    await connectMongoDB();

    // return all markers
    const markers = await Marker.find();
    
    return NextResponse.json({ markers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
