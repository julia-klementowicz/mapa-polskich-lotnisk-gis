import { connectMongoDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function PATCH(req, res) {
  const { username, markerId, newMarker } = await req.json();
  try {
    await connectMongoDB();
    await User.findOneAndUpdate(
      { username, 'markers._id': new mongoose.Types.ObjectId(markerId) },
      { $set: { 'markers.$': newMarker } }
    );
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
