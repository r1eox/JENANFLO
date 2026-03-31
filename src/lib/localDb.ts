import fs from 'fs';
import path from 'path';

// على Vercel نستخدم /tmp لأن نظام الملفات read-only
const IS_VERCEL = !!(process.env.VERCEL || process.env.VERCEL_ENV);
const DATA_DIR = IS_VERCEL
  ? '/tmp/jenanflo-data'
  : path.join(process.cwd(), 'data');

// مجلد البيانات الأصلية (للقراءة فقط عند الحاجة)
const STATIC_DATA_DIR = path.join(process.cwd(), 'data');

// كاش عالمي (global) — يبقى حياً طوال عمر العملية (warm instance)
// يمنع رجوع البيانات المحذوفة بعد الحذف خلال نفس الجلسة
const g = global as typeof globalThis & { _jfCache?: Map<string, unknown[]> };
if (!g._jfCache) g._jfCache = new Map<string, unknown[]>();
const CACHE = g._jfCache;

// التأكد من وجود مجلد البيانات
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// قراءة ملف JSON (مع global cache)
function readJsonFile<T>(filename: string, defaultValue: T): T {
  // 1. تحقق من الكاش أولاً
  if (CACHE.has(filename)) return CACHE.get(filename) as T;

  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filepath)) {
    // على Vercel: حاول نسخ الملف من data/ الأصلية
    if (IS_VERCEL) {
      const staticPath = path.join(STATIC_DATA_DIR, filename);
      if (fs.existsSync(staticPath)) {
        try {
          fs.copyFileSync(staticPath, filepath);
          const data = fs.readFileSync(filepath, 'utf-8');
          const parsed = JSON.parse(data);
          CACHE.set(filename, parsed);
          return parsed;
        } catch {}
      }
    }
    writeJsonFile(filename, defaultValue);
    return defaultValue;
  }

  try {
    const data = fs.readFileSync(filepath, 'utf-8');
    const parsed = JSON.parse(data);
    CACHE.set(filename, parsed);
    return parsed;
  } catch {
    return defaultValue;
  }
}

// كتابة ملف JSON (مع global cache)
function writeJsonFile<T>(filename: string, data: T): void {
  // تحديث الكاش أولاً
  CACHE.set(filename, data as unknown[]);
  // ثم الكتابة للملف كنسخة احتياطية
  try {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* /tmp قد ٚلا يكون متاحاً دائماً */ }
}

// ========================
// المنتجات
// ========================
export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  active: boolean;
  featured?: boolean;
  createdAt: string;
};

const PRODUCTS_FILE = 'products.json';

// البيانات الأولية للمنتجات
const initialProducts: Product[] = [
  {
    _id: "p1",
    name: "باقة ورد أحمر فاخر",
    description: "باقة رومانسية من الورد الأحمر الطبيعي مع تغليف فاخر",
    price: 350,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400",
    category: "flowers",
    stock: 15,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "p2",
    name: "بوكيه تخرج مميز",
    description: "باقة أنيقة للتهنئة بالتخرج مع شريط ذهبي",
    price: 450,
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400",
    category: "flowers",
    stock: 10,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "p3",
    name: "باقة ورد أبيض",
    description: "باقة نقية من الورد الأبيض للمناسبات الخاصة",
    price: 280,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400",
    category: "flowers",
    stock: 20,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "p4",
    name: "شوكولاتة بلجيكية فاخرة",
    description: "علبة شوكولاتة بلجيكية فاخرة 24 قطعة",
    price: 180,
    originalPrice: 220,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
    category: "gifts",
    stock: 25,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "p5",
    name: "ساعة رجالية فاخرة",
    description: "ساعة يد رجالية أنيقة بتصميم كلاسيكي",
    price: 1200,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    category: "men",
    stock: 5,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "p6",
    name: "طقم عطور نسائي",
    description: "طقم عطور فاخر يحتوي على 3 روائح مميزة",
    price: 650,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    category: "women",
    stock: 8,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "p7",
    name: "صندوق هدية فاخر",
    description: "صندوق هدية مصنوع يدوياً بتفاصيل ذهبية",
    price: 320,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400",
    category: "handmade",
    stock: 12,
    active: true,
    createdAt: new Date().toISOString()
  }
];

export function getProducts(): Product[] {
  return readJsonFile<Product[]>(PRODUCTS_FILE, initialProducts);
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p._id === id);
}

export function getProductsByCategory(category: string): Product[] {
  const products = getProducts();
  return products.filter(p => p.category === category && p.active);
}

export function addProduct(product: Omit<Product, '_id' | 'createdAt'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    _id: `p${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  writeJsonFile(PRODUCTS_FILE, products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p._id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  writeJsonFile(PRODUCTS_FILE, products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p._id !== id);
  if (filtered.length === products.length) return false;
  
  writeJsonFile(PRODUCTS_FILE, filtered);
  return true;
}

// ========================
// الأقسام
// ========================
export type Category = {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  image: string;
  active: boolean;
};

const CATEGORIES_FILE = 'categories.json';

const initialCategories: Category[] = [
  {
    _id: "flowers",
    name: "flowers",
    nameAr: "أزهارك",
    description: "باقات الورد الطبيعي والزهور الفاخرة",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400",
    active: true
  },
  {
    _id: "gifts",
    name: "gifts",
    nameAr: "هداياك",
    description: "هدايا مميزة لكل المناسبات",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
    active: true
  },
  {
    _id: "men",
    name: "men",
    nameAr: "أناقتك",
    description: "هدايا رجالية أنيقة وفاخرة",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    active: true
  },
  {
    _id: "women",
    name: "women",
    nameAr: "أنوثتك",
    description: "هدايا نسائية راقية ومميزة",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    active: true
  },
  {
    _id: "handmade",
    name: "handmade",
    nameAr: "فن الإبداع",
    description: "منتجات يدوية الصنع بلمسة فنية",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400",
    active: true
  }
];

export function getCategories(): Category[] {
  return readJsonFile<Category[]>(CATEGORIES_FILE, initialCategories);
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories();
  return categories.find(c => c._id === id);
}

export function addCategory(category: Omit<Category, '_id'>): Category {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    _id: `cat${Date.now()}`
  };
  categories.push(newCategory);
  writeJsonFile(CATEGORIES_FILE, categories);
  return newCategory;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex(c => c._id === id);
  if (index === -1) return null;
  
  categories[index] = { ...categories[index], ...updates };
  writeJsonFile(CATEGORIES_FILE, categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter(c => c._id !== id);
  if (filtered.length === categories.length) return false;
  
  writeJsonFile(CATEGORIES_FILE, filtered);
  return true;
}

// ========================
// الطلبات
// ========================
export type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  extras?: {
    id: string;
    name: string;
    price: number;
  }[];
  extrasTotal?: number;
  discountCode?: string | null;
  discountAmount?: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  giftMessage?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  createdAt: string;
};

const ORDERS_FILE = 'orders.json';

export function getOrders(): Order[] {
  return readJsonFile<Order[]>(ORDERS_FILE, []);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  const orders = getOrders();
  return orders.find(o => o.orderNumber === orderNumber);
}

export function addOrder(orderData: Omit<Order, '_id' | 'orderNumber' | 'createdAt'>): Order {
  const orders = getOrders();
  const orderNumber = `JF-${String(orders.length + 1).padStart(6, '0')}`;
  const newOrder: Order = {
    ...orderData,
    _id: `order${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  writeJsonFile(ORDERS_FILE, orders);
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(o => o._id === id);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], ...updates };
  writeJsonFile(ORDERS_FILE, orders);
  return orders[index];
}

// ========================
// العملاء
// ========================
export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  tags: string[];
  status: string;
  marketing: {
    allowWhatsApp: boolean;
    allowEmail: boolean;
  };
  specialDates?: {
    name: string;
    date: string;
  }[];
  createdAt: string;
};

const CUSTOMERS_FILE = 'customers.json';

export function getCustomers(): Customer[] {
  return readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
}

export function getCustomerById(id: string): Customer | undefined {
  const customers = getCustomers();
  return customers.find(c => c._id === id);
}

export function getCustomerByPhone(phone: string): Customer | undefined {
  const customers = getCustomers();
  return customers.find(c => c.phone === phone);
}

export function addCustomer(customerData: Omit<Customer, '_id' | 'createdAt'> & { totalOrders?: number; totalSpent?: number }): Customer {
  const customers = getCustomers();
  const newCustomer: Customer = {
    ...customerData,
    _id: `cust${Date.now()}`,
    totalOrders: customerData.totalOrders ?? 0,
    totalSpent: customerData.totalSpent ?? 0,
    createdAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  writeJsonFile(CUSTOMERS_FILE, customers);
  return newCustomer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex(c => c._id === id);
  if (index === -1) return null;
  
  customers[index] = { ...customers[index], ...updates };
  writeJsonFile(CUSTOMERS_FILE, customers);
  return customers[index];
}

export function deleteCustomer(id: string): boolean {
  const customers = getCustomers();
  const filtered = customers.filter(c => c._id !== id);
  if (filtered.length === customers.length) return false;
  
  writeJsonFile(CUSTOMERS_FILE, filtered);
  return true;
}

// تحديث إحصائيات العميل عند الطلب
export function updateCustomerStats(phone: string, orderTotal: number): void {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.phone === phone);
  
  if (index !== -1) {
    customers[index].totalOrders += 1;
    customers[index].totalSpent += orderTotal;
    customers[index].lastOrderDate = new Date().toISOString();
    writeJsonFile(CUSTOMERS_FILE, customers);
  }
}

// ========================
// الإحصائيات
// ========================
export function getStats(period: string = 'today') {
  const orders = getOrders();
  const customers = getCustomers();
  const products = getProducts();
  
  // تحديد نطاق التاريخ
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  
  // فلترة الطلبات حسب الفترة
  const filteredOrders = orders.filter(o => new Date(o.createdAt) >= startDate);
  
  // إحصائيات الطلبات
  const totalOrders = filteredOrders.length;
  const newOrders = filteredOrders.filter(o => o.status === 'جديد').length;
  const preparingOrders = filteredOrders.filter(o => o.status === 'جاري التحضير' || o.status === 'قيد المراجعة').length;
  const deliveringOrders = filteredOrders.filter(o => o.status === 'جاري التوصيل').length;
  const deliveredOrders = filteredOrders.filter(o => o.status === 'تم التسليم').length;
  const cancelledOrders = filteredOrders.filter(o => o.status === 'ملغي').length;
  
  // الإيرادات
  const completedOrders = filteredOrders.filter(o => o.status !== 'ملغي');
  const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const tax = completedOrders.reduce((sum, o) => sum + o.tax, 0);
  const collected = completedOrders.filter(o => o.paymentStatus === 'مدفوع').reduce((sum, o) => sum + o.total, 0);
  const pending = revenue - collected;
  const avgOrder = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;
  
  // العملاء
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(c => new Date(c.createdAt) >= startDate).length;
  
  // المنتجات الأكثر مبيعاً
  const productSales: { [key: string]: { name: string; count: number; revenue: number } } = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const name = item.name;
      if (!productSales[name]) {
        productSales[name] = { name, count: 0, revenue: 0 };
      }
      productSales[name].count += item.quantity;
      productSales[name].revenue += item.price * item.quantity;
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ name: p.name, sales: p.count, revenue: p.revenue }));

  // المبيعات حسب القسم
  const categories = getCategories();
  const categorySales: { [key: string]: { name: string; revenue: number } } = {};

  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      // البحث عن القسم من قائمة المنتجات
      const product = products.find(p => p.name === item.name);
      const catId = product?.category || 'other';
      const cat = categories.find(c => c._id === catId || c.name === catId);
      const catName = cat?.nameAr || cat?.name || catId;

      if (!categorySales[catName]) {
        categorySales[catName] = { name: catName, revenue: 0 };
      }
      categorySales[catName].revenue += item.price * item.quantity;
    });
  });

  const totalCatRevenue = Object.values(categorySales).reduce((s, c) => s + c.revenue, 0);
  const salesByCategory = Object.values(categorySales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
    .map(c => ({
      name: c.name,
      revenue: c.revenue,
      percentage: totalCatRevenue > 0 ? Math.round((c.revenue / totalCatRevenue) * 100) : 0
    }));

  return {
    orders: {
      total: totalOrders,
      new: newOrders,
      preparing: preparingOrders,
      delivering: deliveringOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders
    },
    revenue: {
      total: revenue,
      tax,
      collected,
      pending,
      avgOrder
    },
    customers: {
      total: totalCustomers,
      new: newCustomers
    },
    products: {
      total: products.length,
      active: products.filter(p => p.active).length,
      lowStock: products.filter(p => p.stock < 5).length
    },
    topProducts,
    salesByCategory
  };
}

// ========================
// الحملات التسويقية
// ========================
export type Campaign = {
  _id: string;
  name: string;
  type: string;
  status: string;
  target: string;
  message: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
};

const CAMPAIGNS_FILE = 'campaigns.json';

export function getCampaigns(): Campaign[] {
  return readJsonFile<Campaign[]>(CAMPAIGNS_FILE, []);
}

export function getCampaignById(id: string): Campaign | undefined {
  const campaigns = getCampaigns();
  return campaigns.find(c => c._id === id);
}

export function addCampaign(campaignData: Omit<Campaign, '_id' | 'createdAt' | 'sentCount' | 'openRate' | 'clickRate'>): Campaign {
  const campaigns = getCampaigns();
  const newCampaign: Campaign = {
    ...campaignData,
    _id: `camp${Date.now()}`,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: new Date().toISOString()
  };
  campaigns.push(newCampaign);
  writeJsonFile(CAMPAIGNS_FILE, campaigns);
  return newCampaign;
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c._id === id);
  if (index === -1) return null;
  
  campaigns[index] = { ...campaigns[index], ...updates };
  writeJsonFile(CAMPAIGNS_FILE, campaigns);
  return campaigns[index];
}

export function deleteCampaign(id: string): boolean {
  const campaigns = getCampaigns();
  const filtered = campaigns.filter(c => c._id !== id);
  if (filtered.length === campaigns.length) return false;
  
  writeJsonFile(CAMPAIGNS_FILE, filtered);
  return true;
}

// ========================
// المستخدمين (Auth)
// ========================
export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: string;
};

const USERS_FILE = 'users.json';

export function getUsers(): User[] {
  return readJsonFile<User[]>(USERS_FILE, []);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(data: { name: string; email: string; phone?: string; passwordHash: string; role?: 'admin' | 'customer' }): User {
  const users = getUsers();
  const newUser: User = {
    _id: `user${Date.now()}`,
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    passwordHash: data.passwordHash,
    role: data.role || 'customer',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  return newUser;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex(u => u._id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  writeJsonFile(USERS_FILE, users);
  return users[idx];
}

// ===== إعدادات المتجر =====
const SETTINGS_FILE = 'settings.json';

export type StoreSettings = {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  taxEnabled: boolean;
  taxRate: number;
  deliveryFee: number;
  freeDeliveryMin: number;
  paymentMada: boolean;
  paymentTamara: boolean;
  paymentTabby: boolean;
  paymentCOD: boolean;
  autoConfirmOrder: boolean;
  autoPreparingNotify: boolean;
  autoDeliveryNotify: boolean;
  autoDeliveredNotify: boolean;
  autoThankYou: boolean;
  thankYouDelay: number;
  autoAbandonedCart: boolean;
  abandonedCartDelay: number;
  autoBirthdayReminder: boolean;
  birthdayReminderDays: number;
};

const defaultSettings: StoreSettings = {
  storeName: "جنان فلو",
  storePhone: "+966501234567",
  storeEmail: "info@jenanflo.com",
  storeAddress: "الرياض، المملكة العربية السعودية",
  taxEnabled: true,
  taxRate: 15,
  deliveryFee: 25,
  freeDeliveryMin: 300,
  paymentMada: true,
  paymentTamara: true,
  paymentTabby: true,
  paymentCOD: true,
  autoConfirmOrder: true,
  autoPreparingNotify: true,
  autoDeliveryNotify: true,
  autoDeliveredNotify: true,
  autoThankYou: true,
  thankYouDelay: 24,
  autoAbandonedCart: true,
  abandonedCartDelay: 24,
  autoBirthdayReminder: true,
  birthdayReminderDays: 3,
};

export function getSettings(): StoreSettings {
  return readJsonFile<StoreSettings>(SETTINGS_FILE, defaultSettings);
}

export function saveSettings(data: Partial<StoreSettings>): StoreSettings {
  const current = getSettings();
  const updated = { ...current, ...data };
  writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

// ===== أكواد الخصم =====
const COUPONS_FILE = 'coupons.json';

export type Coupon = {
  _id: string;
  code: string;
  discount: number; // نسبة مئوية
  active: boolean;
  createdAt: string;
};

export function getCoupons(): Coupon[] {
  return readJsonFile<Coupon[]>(COUPONS_FILE, []);
}

export function addCoupon(data: Omit<Coupon, '_id' | 'createdAt'>): Coupon {
  const coupons = getCoupons();
  const newCoupon: Coupon = {
    ...data,
    code: data.code.toUpperCase().trim(),
    _id: `cpn${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  coupons.push(newCoupon);
  writeJsonFile(COUPONS_FILE, coupons);
  return newCoupon;
}

export function deleteCoupon(id: string): boolean {
  const coupons = getCoupons();
  const filtered = coupons.filter(c => c._id !== id);
  if (filtered.length === coupons.length) return false;
  writeJsonFile(COUPONS_FILE, filtered);
  return true;
}

export function updateCoupon(id: string, data: Partial<Coupon>): Coupon | null {
  const coupons = getCoupons();
  const index = coupons.findIndex(c => c._id === id);
  if (index === -1) return null;
  coupons[index] = { ...coupons[index], ...data };
  writeJsonFile(COUPONS_FILE, coupons);
  return coupons[index];
}



