// بيانات تجريبية للعمل بدون MongoDB

export const mockCategories = [
  { _id: "cat1", name: "flowers", nameAr: "حديقة الأحلام", description: "أجمل الزهور الطبيعية", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300", active: true, order: 1, productsCount: 12 },
  { _id: "cat2", name: "gifts", nameAr: "كنوز الفرح", description: "هدايا مميزة ومغلفة بأناقة", image: "https://images.unsplash.com/photo-1549488344-cbb6c34cf1d4?w=300", active: true, order: 2, productsCount: 18 },
  { _id: "cat3", name: "men", nameAr: "أناقة الفرسان", description: "هدايا فاخرة للرجال", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300", active: true, order: 3, productsCount: 8 },
  { _id: "cat4", name: "women", nameAr: "همسات الأنوثة", description: "لمسة أنثوية راقية", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=300", active: true, order: 4, productsCount: 15 },
  { _id: "cat5", name: "handmade", nameAr: "لمسات سحرية", description: "تحف يدوية فريدة", image: "https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=300", active: true, order: 5, productsCount: 6 },
];

export const mockProducts = [
  // أزهار (flowers)
  { _id: "prod1", name: "سيمفونية الربيع", description: "باقة ورد ربيعية ملونة بألوان الطبيعة", price: 250, originalPrice: 300, image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400", category: "flowers", stock: 15, active: true, featured: true },
  { _id: "prod3", name: "رقصة التوليب", description: "باقة توليب هولندية أصلية", price: 320, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400", category: "flowers", stock: 12, active: true, featured: true },
  { _id: "prod5", name: "تاج الفخامة", description: "باقة ورد فاخرة للمناسبات الكبرى", price: 890, image: "https://images.unsplash.com/photo-1518882605630-8b1bb4e7ade5?w=400", category: "flowers", stock: 5, active: true, featured: true },
  { _id: "prod8", name: "لؤلؤة البحر", description: "باقة بيضاء راقية", price: 380, image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400", category: "flowers", stock: 9, active: true, featured: false },
  { _id: "prod9", name: "همسة الورد", description: "باقة ورد حمراء رومانسية", price: 220, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400", category: "flowers", stock: 20, active: true, featured: false },
  
  // هدايا (gifts)
  { _id: "prod2", name: "صندوق الأمنيات", description: "صندوق هدايا فاخر مع تغليف أنيق", price: 180, image: "https://images.unsplash.com/photo-1549488344-cbb6c34cf1d4?w=400", category: "gifts", stock: 8, active: true, featured: true },
  { _id: "prod6", name: "همسة الحب", description: "ورد أحمر مع شوكولاتة فاخرة", price: 450, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400", category: "gifts", stock: 20, active: true, featured: false },
  { _id: "prod10", name: "سلة الفرح", description: "سلة هدايا متنوعة للمناسبات السعيدة", price: 350, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", category: "gifts", stock: 15, active: true, featured: true },
  
  // رجال (men)
  { _id: "prod7", name: "أناقة الرجل", description: "طقم هدايا رجالي فاخر", price: 550, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400", category: "men", stock: 7, active: true, featured: false },
  { _id: "prod11", name: "طقم العود الملكي", description: "مجموعة عود فاخرة تليق بالرجل الأنيق", price: 380, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400", category: "men", stock: 10, active: true, featured: true },
  { _id: "prod12", name: "ساعة الوقت الثمين", description: "ساعة فاخرة تجمع بين الأناقة والدقة", price: 650, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", category: "men", stock: 5, active: true, featured: true },
  { _id: "prod13", name: "محفظة الجنتلمان", description: "محفظة جلد طبيعي بتصميم كلاسيكي راقي", price: 220, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", category: "men", stock: 12, active: true, featured: false },
  
  // نساء (women)
  { _id: "prod4", name: "نسمة الأنوثة", description: "باقة ورد وردية رومانسية", price: 280, originalPrice: 350, image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400", category: "women", stock: 10, active: true, featured: true },
  { _id: "prod14", name: "عقد اللؤلؤ الساحر", description: "لؤلؤ طبيعي يعانق جمال الأنثى بأناقة", price: 480, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", category: "women", stock: 8, active: true, featured: true },
  { _id: "prod15", name: "حقيبة الأميرة", description: "حقيبة فاخرة بتصميم يخطف الأنظار", price: 550, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", category: "women", stock: 6, active: true, featured: true },
  { _id: "prod16", name: "عطر الياسمين", description: "عطر فاخر بنفحات زهرية ساحرة", price: 320, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", category: "women", stock: 15, active: true, featured: false },
  
  // يدوي (handmade)
  { _id: "prod17", name: "شمعة الهدوء", description: "شمعة معطرة مصنوعة يدوياً بحب", price: 85, image: "https://images.unsplash.com/photo-1602874801006-e5e54b87a9d9?w=400", category: "handmade", stock: 25, active: true, featured: true },
  { _id: "prod18", name: "سلة الخوص", description: "سلة يدوية من الخوص الطبيعي", price: 120, image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400", category: "handmade", stock: 18, active: true, featured: true },
  { _id: "prod19", name: "إطار الذكريات", description: "إطار خشبي محفور يدوياً", price: 150, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400", category: "handmade", stock: 10, active: true, featured: false },
];

export const mockOrders = [
  {
    _id: "ord1",
    orderNumber: "JF-000156",
    customer: { name: "أحمد محمد", phone: "+966501234567", email: "ahmed@email.com", address: "الرياض، حي النرجس" },
    items: [{ name: "سيمفونية الربيع", quantity: 1, price: 250 }, { name: "صندوق الأمنيات", quantity: 1, price: 180 }],
    status: "جديد",
    subtotal: 430,
    tax: 64.5,
    deliveryFee: 25,
    total: 519.5,
    paymentMethod: "مدى",
    paymentStatus: "مدفوع",
    deliveryDate: "2026-03-03",
    deliveryTime: "14:00 - 16:00",
    createdAt: new Date("2026-03-02T14:30:00"),
  },
  {
    _id: "ord2",
    orderNumber: "JF-000155",
    customer: { name: "سارة علي", phone: "+966507654321", address: "جدة، حي الروضة" },
    items: [{ name: "رقصة التوليب", quantity: 2, price: 320 }],
    status: "جاري التحضير",
    subtotal: 640,
    tax: 96,
    deliveryFee: 30,
    total: 766,
    paymentMethod: "تمارا",
    paymentStatus: "مدفوع",
    deliveryDate: "2026-03-02",
    deliveryTime: "18:00 - 20:00",
    createdAt: new Date("2026-03-02T12:15:00"),
  },
  {
    _id: "ord3",
    orderNumber: "JF-000154",
    customer: { name: "خالد سعد", phone: "+966509876543", address: "الرياض، حي اليرموك" },
    items: [{ name: "تاج الفخامة", quantity: 1, price: 890 }],
    status: "تم التسليم",
    subtotal: 890,
    tax: 133.5,
    deliveryFee: 35,
    total: 1058.5,
    paymentMethod: "مدى",
    paymentStatus: "مدفوع",
    deliveryDate: "2026-03-01",
    deliveryTime: "10:00 - 12:00",
    createdAt: new Date("2026-03-01T09:00:00"),
  },
];

export const mockCustomers = [
  { _id: "cust1", name: "أحمد محمد", phone: "+966501234567", email: "ahmed@email.com", address: "الرياض، حي النرجس", totalOrders: 12, totalSpent: 4560, status: "نشط", tags: ["VIP", "عميل دائم"], marketing: { allowWhatsApp: true, allowEmail: true } },
  { _id: "cust2", name: "سارة علي", phone: "+966507654321", email: "sara@email.com", address: "جدة، حي الروضة", totalOrders: 8, totalSpent: 2890, status: "نشط", tags: ["عميل دائم"], marketing: { allowWhatsApp: true, allowEmail: true } },
  { _id: "cust3", name: "خالد سعد", phone: "+966509876543", address: "الرياض، حي اليرموك", totalOrders: 3, totalSpent: 750, status: "نشط", tags: [], marketing: { allowWhatsApp: true, allowEmail: false } },
  { _id: "cust4", name: "نورة أحمد", phone: "+966505555555", email: "noura@email.com", address: "الدمام، حي الفيصلية", totalOrders: 25, totalSpent: 12500, status: "نشط", tags: ["VIP", "عميل ذهبي"], marketing: { allowWhatsApp: true, allowEmail: true } },
];

export const mockCampaigns = [
  { _id: "camp1", name: "عرض رمضان 2026", type: "عروض", channel: "واتساب", message: { title: "عروض رمضان", body: "خصم 30% على جميع المنتجات", couponCode: "RAMADAN30" }, targeting: { allCustomers: true, tags: [] }, stats: { totalSent: 89, delivered: 85, opened: 72, clicked: 45, conversions: 12 }, status: "مكتملة", createdAt: new Date("2026-02-15") },
  { _id: "camp2", name: "تذكير العملاء", type: "تذكير", channel: "واتساب", message: { title: "نشتقنا لك", body: "خصم خاص للعودة", couponCode: "COMEBACK20" }, targeting: { allCustomers: false, tags: ["غير نشط"] }, stats: { totalSent: 25, delivered: 23, opened: 18, clicked: 8, conversions: 3 }, status: "مكتملة", createdAt: new Date("2026-02-20") },
];

export const mockStats = {
  orders: { total: 156, new: 8, preparing: 12, delivering: 6, delivered: 128, cancelled: 2 },
  revenue: { total: 54320, tax: 8148, collected: 46172, pending: 2890, average: 348 },
  customers: { total: 89, new: 5 },
  topProducts: [
    { name: "سيمفونية الربيع", sales: 45, revenue: 11250 },
    { name: "صندوق الأمنيات", sales: 38, revenue: 6840 },
    { name: "رقصة التوليب", sales: 32, revenue: 10240 },
    { name: "تاج الفخامة", sales: 28, revenue: 24920 },
    { name: "نسمة الأنوثة", sales: 25, revenue: 7000 },
  ],
  salesByCategory: [
    { name: "حديقة الأحلام", percentage: 35, revenue: 19012 },
    { name: "كنوز الفرح", percentage: 28, revenue: 15210 },
    { name: "همسات الأنوثة", percentage: 18, revenue: 9778 },
    { name: "أناقة الفرسان", percentage: 12, revenue: 6518 },
    { name: "لمسات سحرية", percentage: 7, revenue: 3802 },
  ],
};
