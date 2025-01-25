import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req, res) {
  try {
    const { username, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectMongoDB();
    await User.create({ username, password: hashedPassword, markers: [] });

    return NextResponse.json({ message: 'user registered' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'user not registered' },
      { status: 400 },
    );
  }
}
