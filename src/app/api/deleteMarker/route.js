import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function PATCH(req, res) {
  const { username, markerId } = await req.json();
  try {
    await connectMongoDB();

    const user = await User.findOne({ username });

    user.markers = user.markers.filter((marker) => marker._id.toString() !== markerId);
    await user.save();

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
