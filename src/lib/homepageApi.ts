import type { HomepageContentMap, HomepageContentItem } from '@/types/homepage';

const BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function fetchHomepageContent(): Promise<HomepageContentMap> {
  try {
    const res = await fetch(`${BASE}/api/homepage-contents`, {
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data ?? {};
  } catch {
    return {};
  }
}

function adminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};

  // localStorage is the primary token store (set at login)
  const lsToken = localStorage.getItem('token');
  if (lsToken) return { Authorization: `Bearer ${lsToken}` };

  // Fallback: cookie (set alongside localStorage for Next.js middleware)
  const cookieToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')
    .slice(1)
    .join('='); // handles '=' inside base64 values
  if (cookieToken) return { Authorization: `Bearer ${cookieToken}` };

  return {};
}

const ADMIN_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function handleApiError(res: Response): Promise<never> {
  let message = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    message = body.message ?? message;
  } catch { /* ignore */ }
  const err = new Error(message) as Error & { status: number };
  err.status = res.status;
  throw err;
}

export async function fetchAdminHomepageContents(section?: string): Promise<HomepageContentItem[]> {
  const url = new URL(`${ADMIN_BASE}/api/admin/homepage-contents`);
  if (section) url.searchParams.set('section', section);

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) await handleApiError(res);
  const json = await res.json();
  return json.data;
}

export async function upsertHomepageSection(
  section: string,
  fields: { key: string; value: string | null; type: 'text' | 'image' | 'json'; order?: number }[]
): Promise<HomepageContentItem[]> {
  const res = await fetch(`${ADMIN_BASE}/api/admin/homepage-contents/section/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) await handleApiError(res);
  const json = await res.json();
  return json.data;
}

export async function uploadHomepageImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);

  const res = await fetch(`${ADMIN_BASE}/api/admin/homepage-contents/upload-image`, {
    method: 'POST',
    headers: adminAuthHeaders(),
    body: form,
  });
  if (!res.ok) await handleApiError(res);
  const json = await res.json();
  return json.url as string;
}

export async function deleteHomepageContent(id: number): Promise<void> {
  const res = await fetch(`${ADMIN_BASE}/api/admin/homepage-contents/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
  });
  if (!res.ok) await handleApiError(res);
}
