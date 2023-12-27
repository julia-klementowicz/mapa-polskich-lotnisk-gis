import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  try {
    await connectMongoDB();
    const { username } = await req.json();
    const markers = await User.findOne({ username }).select('markers');
    return NextResponse.json({ markers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
