import { cookies } from 'next/headers';
import { verifyToken, getUserById } from '@/lib/auth';

export async function getUserFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value || null;
  if (!token) return { user: null, token: null };

  const decoded: any = verifyToken(token);
  if (!decoded?.id) return { user: null, token: null };

  const user = await getUserById(decoded.id);
  if (!user) return { user: null, token: null };

  return { user, token };
}
