import mongoose from 'mongoose';

const markerSchema = new mongoose.Schema(
  {
    position: {
        type: Array,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ICAO: {
        type: String,
        required: true,
    },
    passengers: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: true,
    },
    rateCount: {
        type: Number,
        required: true,
    },
    rateAverage: {
        type: Number,
        required: true,
    },
    ratings: {
        type: Array,
        required: true,
    },
  },
  {
    timestamps: false,
  }
);

const Marker = mongoose.models.Marker || mongoose.model('Marker', markerSchema);
export default Marker;
