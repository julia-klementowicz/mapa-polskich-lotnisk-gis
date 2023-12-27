import { connectMongoDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function PATCH(req, res) {
  // delete marker from user's markers array
  const { username, markerId } = await req.json();
  try {
    await connectMongoDB();
    await User.findOneAndUpdate(
      { username },
      { $pull: { markers: { _id: new mongoose.Types.ObjectId(markerId) } } }
    );
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
