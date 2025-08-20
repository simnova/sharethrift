import { Schema, model } from 'mongoose';

const ViewListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ViewListing = model('ViewListing', ViewListingSchema);
