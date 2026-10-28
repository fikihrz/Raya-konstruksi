/**
 * Centralized API helper for admin dashboard.
 * - Attaches Authorization: Bearer <token> to every request
 * - Handles 401 SESSION_INVALIDATED → auto logout + redirect
 * - Provides typed fetch wrapper
 */

const API = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://backend-three-beta-90.vercel.app';

export { API };

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function logout(reason?: string) {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  // Redirect to login with reason
  const url = reason
    ? `/login?reason=${encodeURIComponent(reason)}`
    : '/login';
  window.location.href = url;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  // Handle session invalidation globally
  if (res.status === 401) {
    let body: any = {};
    try {
      body = await res.clone().json();
    } catch {}

    if (
      body.code === 'SESSION_INVALIDATED' ||
      body.code === 'TOKEN_EXPIRED' ||
      body.code === 'INVALID_TOKEN' ||
      body.code === 'NO_TOKEN'
    ) {
      logout(body.code === 'SESSION_INVALIDATED'
        ? 'session_invalidated'
        : 'session_expired'
      );
    }
  }

  return res;
}

/**
 * Verifies the current session with the server.
 * Returns true if valid, false + triggers logout if not.
 */
export async function verifySession(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await apiFetch('/api/auth/verify');
    if (res.ok) return true;

    // Session invalid - logout handled in apiFetch
    return false;
  } catch {
    // Network error - don't logout, just return false
    return false;
  }
}
