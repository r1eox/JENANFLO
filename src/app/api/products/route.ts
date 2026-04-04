import { 
  getProducts, 
  getProductsByCategory, 
  getCategories,
  addProduct, 
  updateProduct, 
  deleteProduct 
} from "@/lib/localDb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  
  let products = await getProducts();
  
  if (category) {
    const categories = await getCategories();
    const cat = categories.find(c => c._id === category || c.name === category);
    const validValues = cat ? [cat._id, cat.name].filter(Boolean) : [category];
    products = products.filter(p => validValues.includes(p.category) && p.active);
  }
  
  if (featured === 'true') {
    products = products.filter(p => p.featured === true);
  }
  
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await addProduct({
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      image: data.image || "",
      category: data.category || "gifts",
      stock: Number(data.stock) || 10,
      active: data.active !== false,
      featured: data.featured === true
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "خطأ في إضافة المنتج" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { _id, ...updateData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
    }
    
    const product = await updateProduct(_id, updateData);
    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "خطأ في تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
    }
    
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "خطأ في حذف المنتج" }, { status: 500 });
  }
}
