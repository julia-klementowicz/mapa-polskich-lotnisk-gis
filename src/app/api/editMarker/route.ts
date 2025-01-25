import { connectMongoDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function PATCH(req, res) {
  const { username, markerId, newMarker } = await req.json();
  try {
    await connectMongoDB();

    const user = await User.findOne({ username });

    const markerIndex = user.markers.findIndex((marker) => marker._id.toString() === markerId);
    user.markers[markerIndex] = newMarker;
    await user.save();

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
