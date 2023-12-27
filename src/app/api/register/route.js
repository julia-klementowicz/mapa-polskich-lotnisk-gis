import { connectMongoDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { markers } from '@/data/markers';

export async function POST(req, res) {
  try {
    const { username, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const markersWithIds = markers.map((marker) => ({
      _id: new mongoose.Types.ObjectId(),
      ...marker,
    }))

    await connectMongoDB();
    await User.create({ username, password: hashedPassword, markers: markersWithIds });

    return NextResponse.json({ message: 'user registered' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'user not registered' },
      { status: 400 },
    );
  }
}
