import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzqpotzfgtjkuuddlbxg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client للاستخدام في المتصفح
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// دالة رفع الصورة إلى Supabase Storage
export async function uploadImage(file: File, bucket: string = 'products'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // الحصول على رابط الصورة العام
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
}

// دالة حذف الصورة
export async function deleteImage(imageUrl: string, bucket: string = 'products'): Promise<boolean> {
  try {
    // استخراج اسم الملف من الرابط
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    return !error;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
