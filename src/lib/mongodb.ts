import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jenanflo";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, failed: false };
}

export async function dbConnect() {
  // إذا فشل الاتصال سابقاً، لا نحاول مرة أخرى
  if (cached.failed) {
    return null;
  }
  
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // 3 ثواني فقط بدلاً من 30
      connectTimeoutMS: 3000,
    }).then((mongoose) => {
      console.log("✅ Connected to MongoDB");
      return mongoose;
    }).catch((err) => {
      console.log("⚠️ MongoDB not available, using mock data");
      cached.failed = true;
      return null;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// للتحقق إذا كان MongoDB متصل
export function isDbConnected() {
  return cached.conn !== null && !cached.failed;
}
