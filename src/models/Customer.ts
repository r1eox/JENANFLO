import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  address: { type: String },
  location: {
    lat: Number,
    lng: Number
  },
  // إحصائيات العميل
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  // تفضيلات العميل
  preferences: {
    favoriteCategories: [String],
    favoriteProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    specialDates: [{
      name: String, // عيد ميلاد، ذكرى زواج، إلخ
      date: Date
    }]
  },
  // التسويق
  marketing: {
    allowWhatsApp: { type: Boolean, default: true },
    allowEmail: { type: Boolean, default: true },
    allowSMS: { type: Boolean, default: true },
    lastCampaignSent: Date,
    campaignsReceived: { type: Number, default: 0 }
  },
  // الملاحظات
  notes: String,
  tags: [String], // VIP, عميل دائم، إلخ
  // الحالة
  status: { type: String, enum: ["نشط", "غير نشط", "محظور"], default: "نشط" },
}, {
  timestamps: true // يضيف createdAt و updatedAt تلقائياً
});

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
