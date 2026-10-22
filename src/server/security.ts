import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: unknown, encoded: unknown): boolean {
  if (typeof password !== 'string' || password.length > 1024 || typeof encoded !== 'string') return false;
  const parts = encoded.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt' || !/^[a-f0-9]{32}$/.test(parts[1]) || !/^[a-f0-9]{128}$/.test(parts[2])) return false;
  return timingSafeEqual(Buffer.from(parts[2], 'hex'), scryptSync(password, parts[1], 64));
}
export function sessionIsValid(session: {createdAt:number} | undefined, token:string, now=Date.now()): boolean {
  return Boolean(session && /^spt_sess_[a-f0-9]{64}$/.test(token) && now >= session.createdAt && now-session.createdAt < 12*60*60*1000);
}
