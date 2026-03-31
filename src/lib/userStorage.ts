/**
 * userStorage.ts
 * كل بيانات localStorage مرتبطة بالمستخدم الحالي (بإيميله)
 * بدلاً من مشاركتها بين جميع المستخدمين
 */

/** يُرجع إيميل المستخدم الحالي، أو 'guest' إذا لم يكن مسجلاً */
export function getCurrentUserEmail(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const stored = localStorage.getItem('jenanflo_user');
    if (!stored) return 'guest';
    const user = JSON.parse(stored);
    return user.email ? user.email.toLowerCase() : 'guest';
  } catch {
    return 'guest';
  }
}

/** يُحوّل مفتاحاً عاماً إلى مفتاح خاص بالمستخدم الحالي */
export function userKey(baseKey: string): string {
  const email = getCurrentUserEmail();
  return `${baseKey}__${email}`;
}

/** قراءة بيانات المستخدم الحالي */
export function getUD<T>(baseKey: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(userKey(baseKey));
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** حفظ بيانات المستخدم الحالي */
export function setUD<T>(baseKey: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(userKey(baseKey), JSON.stringify(value));
}

/** حذف بيانات المستخدم الحالي */
export function removeUD(baseKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(userKey(baseKey));
}

/** إرسال حدث لتحديث جميع المكونات بعد تسجيل الدخول/الخروج */
export function dispatchUserChanged(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('user-changed'));
  window.dispatchEvent(new Event('cart-updated'));
}
