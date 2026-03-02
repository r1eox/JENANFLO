import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    location: {
      lat: Number,
      lng: Number
    }
  },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  status: { 
    type: String, 
    enum: ["جديد", "قيد المراجعة", "جاري التحضير", "جاري التوصيل", "تم التسليم", "ملغي"], 
    default: "جديد" 
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  discount: Number,
  total: Number,
  paymentMethod: { type: String, enum: ["مدى", "تمارا", "تابي", "عند الاستلام"] },
  paymentStatus: { type: String, enum: ["غير مدفوع", "مدفوع", "مسترجع"], default: "غير مدفوع" },
  giftMessage: String,
  deliveryDate: Date,
  deliveryTime: String,
  notes: String,
  invoiceSent: { type: Boolean, default: false },
  thankYouSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// توليد رقم الطلب تلقائياً
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderNumber = `JF-${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
