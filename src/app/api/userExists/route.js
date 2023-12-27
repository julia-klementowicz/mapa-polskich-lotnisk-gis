import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  try {
    await connectMongoDB();
    const { username } = await req.json();
    const user = await User.findOne({ username }).select('_id');
    return NextResponse.json({ userExists: !!user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
