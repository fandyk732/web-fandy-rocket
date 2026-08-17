import { createHmac, timingSafeEqual } from 'crypto';

// 🔒 Session token yang di-SIGN pakai secret server, bukan string tetap kayak
// 'authenticated'. Format: "<expiryTimestamp>.<signature>". Signature-nya
// HMAC-SHA256 dari expiryTimestamp pakai secret — nggak mungkin dipalsuin
// tanpa tau secret-nya, walau orang tau persis formatnya.
//
// Secret diambil dari ADMIN_PASSWORD (udah ada di env, nggak perlu tambah
// env var baru) digabung string tetap, biar kalau ADMIN_PASSWORD ke-leak
// secara terpisah nggak otomatis ngasih tau secret signing ini.
function getSecret(): string {
  const base = process.env.ADMIN_PASSWORD;
  if (!base) {
    throw new Error('ADMIN_PASSWORD belum di-set di environment variables.');
  }
  return `admin-session-secret::${base}`;
}

const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 1000; // 1 hari, samain sama maxAge cookie

export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_MAX_AGE_MS;
  const signature = createHmac('sha256', getSecret()).update(String(expiry)).digest('hex');
  return `${expiry}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [expiryStr, signature] = token.split('.');
  if (!expiryStr || !signature) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false; // token expired

  const expectedSignature = createHmac('sha256', getSecret()).update(expiryStr).digest('hex');

  // timingSafeEqual butuh buffer dengan panjang sama — kalau beda panjang,
  // signature-nya pasti salah, jadi langsung return false tanpa compare.
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

// Dipanggil di awal setiap API route yang butuh admin login (POST/PUT/DELETE
// artikel, dan API mutasi admin lain di masa depan).
export function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : undefined;
  return verifySessionToken(token);
}