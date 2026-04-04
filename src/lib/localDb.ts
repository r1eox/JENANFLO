import { prisma } from './prismaClient';

// ========================
// Types
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

export type Category = {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  image: string;
  active: boolean;
};

export type Order = {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; email?: string; address: string };
  items: { productId: string; name: string; price: number; quantity: number; image?: string }[];
  extras?: { id: string; name: string; price: number }[];
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
  marketing: { allowWhatsApp: boolean; allowEmail: boolean };
  specialDates?: { name: string; date: string }[];
  createdAt: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: string;
};

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

export type Coupon = {
  _id: string;
  code: string;
  discount: number;
  active: boolean;
  createdAt: string;
};

// ========================
// Mappers
// ========================
function d(v: Date | string): string {
  return v instanceof Date ? v.toISOString() : String(v);
}
function mapProduct(p: any): Product {
  return { _id: p.id, name: p.name, description: p.description || '', price: Number(p.price), originalPrice: p.originalPrice ?? undefined, image: p.image || '', category: p.category || '', stock: Number(p.stock), active: Boolean(p.active), featured: Boolean(p.featured), createdAt: d(p.createdAt) };
}
function mapCategory(c: any): Category {
  return { _id: c.id, name: c.name, nameAr: c.nameAr, description: c.description || '', image: c.image || '', active: Boolean(c.active) };
}
function mapOrder(o: any): Order {
  return { _id: o.id, orderNumber: o.orderNumber, customer: o.customer as any, items: o.items as any, extras: (o.extras as any) || [], extrasTotal: Number(o.extrasTotal || 0), discountCode: o.discountCode, discountAmount: Number(o.discountAmount || 0), subtotal: Number(o.subtotal), tax: Number(o.tax || 0), deliveryFee: Number(o.deliveryFee || 0), total: Number(o.total), status: o.status, paymentMethod: o.paymentMethod, paymentStatus: o.paymentStatus, giftMessage: o.giftMessage ?? undefined, deliveryDate: o.deliveryDate ?? undefined, deliveryTime: o.deliveryTime ?? undefined, notes: o.notes ?? undefined, createdAt: d(o.createdAt) };
}
function mapCustomer(c: any): Customer {
  return { _id: c.id, name: c.name, phone: c.phone, email: c.email ?? undefined, address: c.address ?? undefined, totalOrders: Number(c.totalOrders), totalSpent: Number(c.totalSpent), lastOrderDate: c.lastOrderDate ?? undefined, tags: c.tags || [], status: c.status, marketing: (c.marketing as any) || { allowWhatsApp: true, allowEmail: true }, specialDates: (c.specialDates as any) || [], createdAt: d(c.createdAt) };
}
function mapUser(u: any): User {
  return { _id: u.id, name: u.name, email: u.email, phone: u.phone ?? undefined, passwordHash: u.passwordHash, role: u.role as 'admin' | 'customer', createdAt: d(u.createdAt) };
}
function mapCampaign(c: any): Campaign {
  return { _id: c.id, name: c.name, type: c.type, status: c.status, target: c.target, message: c.message, sentCount: Number(c.sentCount), openRate: Number(c.openRate), clickRate: Number(c.clickRate), scheduledAt: c.scheduledAt ?? undefined, sentAt: c.sentAt ?? undefined, createdAt: d(c.createdAt) };
}
function mapCoupon(c: any): Coupon {
  return { _id: c.id, code: c.code, discount: Number(c.discount), active: Boolean(c.active), createdAt: d(c.createdAt) };
}

// ========================
// البيانات الأولية (Seed)
// ========================
const seedProducts = [
  { id: 'p1', name: 'باقة ورد أحمر فاخر', description: 'باقة فاخرة من أجمل أنواع الورد الأحمر الطبيعي', price: 350, originalPrice: 450, image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400', category: 'flowers', stock: 15, active: true, featured: true },
  { id: 'p2', name: 'بوكيه تخرج مميز', description: 'باقة أنيقة للتهنئة بالتخرج مع شريط ذهبي', price: 450, image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400', category: 'flowers', stock: 10, active: true, featured: false },
  { id: 'p3', name: 'باقة ورد أبيض', description: 'باقة نقية من الورد الأبيض للمناسبات الخاصة', price: 280, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400', category: 'flowers', stock: 20, active: true, featured: false },
  { id: 'p4', name: 'شوكولاتة بلجيكية فاخرة', description: 'علبة شوكولاتة بلجيكية فاخرة 24 قطعة', price: 180, originalPrice: 220, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', category: 'gifts', stock: 25, active: true, featured: true },
  { id: 'p5', name: 'ساعة رجالية فاخرة', description: 'ساعة يد رجالية أنيقة بتصميم كلاسيكي', price: 1200, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', category: 'men', stock: 5, active: true, featured: false },
  { id: 'p6', name: 'طقم عطور نسائي', description: 'طقم عطور فاخر يحتوي على 3 روائح مميزة', price: 650, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'women', stock: 8, active: true, featured: true },
  { id: 'p7', name: 'صندوق هدية فاخر', description: 'صندوق هدية مصنوع يدوياً بتفاصيل ذهبية', price: 320, image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400', category: 'handmade', stock: 12, active: true, featured: false },
];
const seedCategories = [
  { id: 'flowers', name: 'flowers', nameAr: 'أزهارك', description: 'باقات الورد الطبيعي والزهور الفاخرة', image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400', active: true },
  { id: 'gifts', name: 'gifts', nameAr: 'هداياك', description: 'هدايا مميزة لكل المناسبات', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', active: true },
  { id: 'men', name: 'men', nameAr: 'أناقتك', description: 'هدايا رجالية أنيقة وفاخرة', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', active: true },
  { id: 'women', name: 'women', nameAr: 'أنوثتك', description: 'هدايا نسائية راقية ومميزة', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', active: true },
  { id: 'handmade', name: 'handmade', nameAr: 'فن الإبداع', description: 'منتجات يدوية الصنع بلمسة فنية', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400', active: true },
];

// ========================
// Products
// ========================
export async function getProducts(): Promise<Product[]> {
  let rows = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  if (rows.length === 0) {
    await prisma.product.createMany({ data: seedProducts.map(p => ({ ...p, originalPrice: (p as any).originalPrice ?? null })) });
    rows = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  }
  return rows.map(mapProduct);
}
export async function getProductById(id: string): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({ where: { id } });
  return p ? mapProduct(p) : undefined;
}
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({ where: { OR: [{ category }, { category: { equals: category } }], active: true } });
  return rows.map(mapProduct);
}
export async function addProduct(data: Omit<Product, '_id' | 'createdAt'>): Promise<Product> {
  const p = await prisma.product.create({ data: { id: `p${Date.now()}`, name: data.name, description: data.description || '', price: data.price, originalPrice: data.originalPrice ?? null, image: data.image || '', category: data.category || '', stock: data.stock || 0, active: data.active !== false, featured: data.featured || false } });
  return mapProduct(p);
}
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const { _id, createdAt, ...data } = updates as any;
    const p = await prisma.product.update({ where: { id }, data });
    return mapProduct(p);
  } catch { return null; }
}
export async function deleteProduct(id: string): Promise<boolean> {
  try { await prisma.product.delete({ where: { id } }); return true; } catch { return false; }
}

// ========================
// Categories
// ========================
export async function getCategories(): Promise<Category[]> {
  let rows = await prisma.category.findMany();
  if (rows.length === 0) {
    await prisma.category.createMany({ data: seedCategories });
    rows = await prisma.category.findMany();
  }
  return rows.map(mapCategory);
}
export async function getCategoryById(id: string): Promise<Category | undefined> {
  const c = await prisma.category.findUnique({ where: { id } });
  return c ? mapCategory(c) : undefined;
}
export async function addCategory(data: Omit<Category, '_id'>): Promise<Category> {
  const c = await prisma.category.create({ data: { id: `cat${Date.now()}`, name: data.name, nameAr: data.nameAr, description: data.description || '', image: data.image || '', active: data.active !== false } });
  return mapCategory(c);
}
export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    const { _id, ...data } = updates as any;
    const c = await prisma.category.update({ where: { id }, data });
    return mapCategory(c);
  } catch { return null; }
}
export async function deleteCategory(id: string): Promise<boolean> {
  try { await prisma.category.delete({ where: { id } }); return true; } catch { return false; }
}

// ========================
// Orders
// ========================
export async function getOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(mapOrder);
}
export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const o = await prisma.order.findUnique({ where: { orderNumber } });
  return o ? mapOrder(o) : undefined;
}
export async function addOrder(data: Omit<Order, '_id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
  const count = await prisma.order.count();
  const orderNumber = `JF-${String(count + 1).padStart(6, '0')}`;
  const o = await prisma.order.create({ data: { id: `order${Date.now()}`, orderNumber, customer: data.customer as any, items: data.items as any, extras: (data.extras || []) as any, extrasTotal: data.extrasTotal || 0, discountCode: data.discountCode || null, discountAmount: data.discountAmount || 0, subtotal: data.subtotal || 0, tax: data.tax || 0, deliveryFee: data.deliveryFee || 0, total: data.total, status: data.status || 'جديد', paymentMethod: data.paymentMethod || 'نقدي', paymentStatus: data.paymentStatus || 'معلق', giftMessage: data.giftMessage || null, deliveryDate: data.deliveryDate || null, deliveryTime: data.deliveryTime || null, notes: data.notes || null } });
  return mapOrder(o);
}
export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const { _id, orderNumber, createdAt, ...data } = updates as any;
    const o = await prisma.order.update({ where: { id }, data });
    return mapOrder(o);
  } catch { return null; }
}

// ========================
// Customers
// ========================
export async function getCustomers(): Promise<Customer[]> {
  const rows = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(mapCustomer);
}
export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const c = await prisma.customer.findUnique({ where: { id } });
  return c ? mapCustomer(c) : undefined;
}
export async function getCustomerByPhone(phone: string): Promise<Customer | undefined> {
  const c = await prisma.customer.findUnique({ where: { phone } });
  return c ? mapCustomer(c) : undefined;
}
export async function addCustomer(data: Omit<Customer, '_id' | 'createdAt'> & { totalOrders?: number; totalSpent?: number }): Promise<Customer> {
  const c = await prisma.customer.create({ data: { id: `cust${Date.now()}`, name: data.name, phone: data.phone, email: data.email || null, address: data.address || null, totalOrders: data.totalOrders ?? 0, totalSpent: data.totalSpent ?? 0, lastOrderDate: data.lastOrderDate || null, tags: data.tags || [], status: data.status || 'نشط', marketing: (data.marketing || { allowWhatsApp: true, allowEmail: true }) as any, specialDates: (data.specialDates || []) as any } });
  return mapCustomer(c);
}
export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  try {
    const { _id, createdAt, ...data } = updates as any;
    const c = await prisma.customer.update({ where: { id }, data });
    return mapCustomer(c);
  } catch { return null; }
}
export async function deleteCustomer(id: string): Promise<boolean> {
  try { await prisma.customer.delete({ where: { id } }); return true; } catch { return false; }
}
export async function updateCustomerStats(phone: string, orderTotal: number): Promise<void> {
  const c = await prisma.customer.findUnique({ where: { phone } });
  if (c) {
    await prisma.customer.update({ where: { phone }, data: { totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + orderTotal, lastOrderDate: new Date().toISOString() } });
  }
}

// ========================
// Users
// ========================
export async function getUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany();
  return rows.map(mapUser);
}
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const u = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  return u ? mapUser(u) : undefined;
}
export async function addUser(data: { name: string; email: string; phone?: string; passwordHash: string; role?: 'admin' | 'customer' }): Promise<User> {
  const u = await prisma.user.create({ data: { id: `user${Date.now()}`, name: data.name, email: data.email.toLowerCase(), phone: data.phone || null, passwordHash: data.passwordHash, role: data.role || 'customer' } });
  return mapUser(u);
}
export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    const { _id, createdAt, ...rest } = data as any;
    const u = await prisma.user.update({ where: { id }, data: rest });
    return mapUser(u);
  } catch { return null; }
}

// ========================
// Campaigns
// ========================
export async function getCampaigns(): Promise<Campaign[]> {
  const rows = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(mapCampaign);
}
export async function getCampaignById(id: string): Promise<Campaign | undefined> {
  const c = await prisma.campaign.findUnique({ where: { id } });
  return c ? mapCampaign(c) : undefined;
}
export async function addCampaign(data: Omit<Campaign, '_id' | 'createdAt' | 'sentCount' | 'openRate' | 'clickRate'>): Promise<Campaign> {
  const c = await prisma.campaign.create({ data: { id: `camp${Date.now()}`, name: data.name, type: data.type, status: data.status || 'مسودة', target: data.target || 'الكل', message: data.message || '', sentCount: 0, openRate: 0, clickRate: 0, scheduledAt: data.scheduledAt || null, sentAt: data.sentAt || null } });
  return mapCampaign(c);
}
export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
  try {
    const { _id, createdAt, ...data } = updates as any;
    const c = await prisma.campaign.update({ where: { id }, data });
    return mapCampaign(c);
  } catch { return null; }
}
export async function deleteCampaign(id: string): Promise<boolean> {
  try { await prisma.campaign.delete({ where: { id } }); return true; } catch { return false; }
}

// ========================
// Settings
// ========================
const defaultSettings: StoreSettings = { storeName: 'جنان فلو', storePhone: '+966501234567', storeEmail: 'info@jenanflo.com', storeAddress: 'الرياض، المملكة العربية السعودية', taxEnabled: true, taxRate: 15, deliveryFee: 25, freeDeliveryMin: 300, paymentMada: true, paymentTamara: true, paymentTabby: true, paymentCOD: true, autoConfirmOrder: true, autoPreparingNotify: true, autoDeliveryNotify: true, autoDeliveredNotify: true, autoThankYou: true, thankYouDelay: 24, autoAbandonedCart: true, abandonedCartDelay: 24, autoBirthdayReminder: true, birthdayReminderDays: 3 };

export async function getSettings(): Promise<StoreSettings> {
  const s = await prisma.settings.findUnique({ where: { id: 'singleton' } });
  if (!s) {
    await prisma.settings.create({ data: { id: 'singleton', ...defaultSettings } });
    return defaultSettings;
  }
  const { id, ...rest } = s;
  return rest as StoreSettings;
}
export async function saveSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
  const s = await prisma.settings.upsert({ where: { id: 'singleton' }, update: data, create: { id: 'singleton', ...defaultSettings, ...data } });
  const { id, ...rest } = s;
  return rest as StoreSettings;
}

// ========================
// Coupons
// ========================
export async function getCoupons(): Promise<Coupon[]> {
  const rows = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(mapCoupon);
}
export async function addCoupon(data: Omit<Coupon, '_id' | 'createdAt'>): Promise<Coupon> {
  const c = await prisma.coupon.create({ data: { id: `coup${Date.now()}`, code: data.code.toUpperCase().trim(), discount: data.discount, active: data.active !== false } });
  return mapCoupon(c);
}
export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
  try {
    const { _id, createdAt, ...rest } = data as any;
    const c = await prisma.coupon.update({ where: { id }, data: rest });
    return mapCoupon(c);
  } catch { return null; }
}
export async function deleteCoupon(id: string): Promise<boolean> {
  try { await prisma.coupon.delete({ where: { id } }); return true; } catch { return false; }
}

// ========================
// Stats
// ========================
export async function getStats(period: string = 'today') {
  const now = new Date();
  let startDate: Date;
  switch (period) {
    case 'week':   startDate = new Date(now.getTime() - 7 * 86400000); break;
    case 'month':  startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
    case 'year':   startDate = new Date(now.getFullYear(), 0, 1); break;
    default:       startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const [allOrders, customers, products, categories] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: startDate } } }),
    prisma.customer.findMany({ where: { createdAt: { gte: startDate } }, select: { id: true } }),
    prisma.product.findMany({ select: { id: true, active: true, stock: true, name: true, category: true } }),
    prisma.category.findMany(),
  ]);
  const totalCustomers = await prisma.customer.count();

  const completedOrders = allOrders.filter(o => o.status !== 'ملغي');
  const revenue = completedOrders.reduce((s, o) => s + Number(o.total), 0);
  const collected = completedOrders.filter(o => o.paymentStatus === 'مدفوع').reduce((s, o) => s + Number(o.total), 0);

  const productSales: Record<string, { name: string; count: number; revenue: number; category: string }> = {};
  allOrders.forEach(order => {
    const items = (order.items as any[]) || [];
    items.forEach((item: any) => {
      if (!productSales[item.name]) productSales[item.name] = { name: item.name, count: 0, revenue: 0, category: item.category || '' };
      productSales[item.name].count += item.quantity || 1;
      productSales[item.name].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const categorySales: Record<string, { name: string; revenue: number }> = {};
  allOrders.forEach(order => {
    const items = (order.items as any[]) || [];
    items.forEach((item: any) => {
      const prod = products.find(p => p.name === item.name);
      const catId = prod?.category || 'other';
      const cat = categories.find(c => c.id === catId || c.name === catId);
      const catName = cat?.nameAr || cat?.name || catId;
      if (!categorySales[catName]) categorySales[catName] = { name: catName, revenue: 0 };
      categorySales[catName].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });
  const totalCatRev = Object.values(categorySales).reduce((s, c) => s + c.revenue, 0);

  return {
    orders: {
      total: allOrders.length,
      new: allOrders.filter(o => o.status === 'جديد').length,
      preparing: allOrders.filter(o => ['جاري التحضير', 'قيد المراجعة'].includes(o.status)).length,
      delivering: allOrders.filter(o => o.status === 'جاري التوصيل').length,
      delivered: allOrders.filter(o => o.status === 'تم التسليم').length,
      cancelled: allOrders.filter(o => o.status === 'ملغي').length,
    },
    revenue: {
      total: revenue,
      tax: completedOrders.reduce((s, o) => s + Number(o.tax || 0), 0),
      collected,
      pending: revenue - collected,
      avgOrder: allOrders.length > 0 ? Math.round(revenue / allOrders.length) : 0,
    },
    customers: { total: totalCustomers, new: customers.length },
    products: { total: products.length, active: products.filter(p => p.active).length, lowStock: products.filter(p => Number(p.stock) < 5).length },
    topProducts: Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5).map(p => ({ name: p.name, sales: p.count, revenue: p.revenue })),
    salesByCategory: Object.values(categorySales).sort((a, b) => b.revenue - a.revenue).slice(0, 6).map(c => ({ name: c.name, revenue: c.revenue, percentage: totalCatRev > 0 ? Math.round(c.revenue / totalCatRev * 100) : 0 })),
  };
}

