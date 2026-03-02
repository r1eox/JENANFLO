import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true }, // اسم إنجليزي للرابط
  nameAr: { type: String, required: true }, // الاسم العربي
  description: String,
  icon: String,
  image: String,
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
