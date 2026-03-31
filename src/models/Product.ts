import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  originalPrice: Number, // السعر قبل الخصم
  image: String,
  images: [String], // صور إضافية
  category: String,
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 10 },
  sku: String, // رمز المنتج
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.pre('save', function(this: any, next: any) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
