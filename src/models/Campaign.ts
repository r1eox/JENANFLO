import mongoose, { Schema } from "mongoose";

const CampaignSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["ترويجية", "تذكير", "عيد ميلاد", "ذكرى", "عروض", "جديد"], 
    default: "ترويجية" 
  },
  channel: { 
    type: String, 
    enum: ["واتساب", "بريد إلكتروني", "SMS", "الكل"], 
    default: "واتساب" 
  },
  // محتوى الرسالة
  message: {
    title: String,
    body: { type: String, required: true },
    image: String,
    link: String,
    couponCode: String
  },
  // استهداف العملاء
  targeting: {
    allCustomers: { type: Boolean, default: false },
    customerIds: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
    tags: [String], // VIP, عميل دائم
    minOrders: Number,
    minSpent: Number,
    lastOrderDays: Number, // لم يشتروا منذ X يوم
  },
  // الجدولة
  schedule: {
    sendNow: { type: Boolean, default: true },
    scheduledDate: Date,
    recurring: { type: Boolean, default: false },
    recurringType: { type: String, enum: ["يومي", "أسبوعي", "شهري"] }
  },
  // الإحصائيات
  stats: {
    totalSent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ["مسودة", "مجدولة", "جاري الإرسال", "مكتملة", "متوقفة"], 
    default: "مسودة" 
  },
  createdAt: { type: Date, default: Date.now },
  sentAt: Date,
});

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
