import { connectMongoDB } from '@/lib/mongodb';
import Marker from '@/models/marker';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const { username, comment, rate, markerId } = await req.json();
  console.log('server', { username, comment, rate, markerId });
  try {
    await connectMongoDB();
    const marker = await Marker.findById(markerId);

    const newRating = {
      _id: new mongoose.Types.ObjectId(),
      comment,
      rate: Number(rate),
      username,
      createdAt: new Date(),
    };
    marker.ratings.push(newRating);
    marker.rateAverage =
      (marker.rateAverage * marker.rateCount + Number(rate)) /
      (marker.rateCount + 1);
    marker.rateCount += 1;
    await marker.save();

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
