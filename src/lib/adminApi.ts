const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function authHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};

  const lsToken = localStorage.getItem('token');
  if (lsToken) return { Authorization: `Bearer ${lsToken}` };

  const cookieToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')
    .slice(1)
    .join('=');
  if (cookieToken) return { Authorization: `Bearer ${cookieToken}` };

  return {};
}

export interface OverviewStats {
  users: { total: number; new_this_month: number; verified: number };
  trips: { total: number; draft: number; active: number; completed: number; new_this_month: number };
}

export interface DayBucket { date: string; count: number }
export interface TypeBucket { type: string; count: number }

export interface OverviewCharts {
  signups_last_30d: DayBucket[];
  trips_last_30d:   DayBucket[];
  trips_by_type:    TypeBucket[];
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  email_verified_at: string | null;
  role: { id: number; name: string; slug: string } | null;
}

export interface RecentTrip {
  id: number;
  name: string;
  destination: string;
  destination_flag: string | null;
  status: 'draft' | 'active' | 'completed';
  travel_type: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  user: { id: number; name: string; email: string } | null;
}

export interface OverviewData {
  stats:        OverviewStats;
  charts:       OverviewCharts;
  recent_users: RecentUser[];
  recent_trips: RecentTrip[];
}

export async function fetchAdminOverview(): Promise<OverviewData> {
  const res = await fetch(`${BASE}/api/admin/overview`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Overview fetch failed: ${res.status}`);
  return res.json();
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  trips_count: number;
  role: { id: number; name: string; slug: string } | null;
}

export interface UserListMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface UserListParams {
  search?: string;
  role?: string;
  verified?: '0' | '1' | '';
  sort?: string;
  dir?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export async function fetchAdminUsers(params: UserListParams = {}): Promise<{ data: AdminUser[]; meta: UserListMeta }> {
  const q = new URLSearchParams();
  if (params.search)   q.set('search',   params.search);
  if (params.role)     q.set('role',     params.role);
  if (params.verified) q.set('verified', params.verified);
  if (params.sort)     q.set('sort',     params.sort);
  if (params.dir)      q.set('dir',      params.dir);
  if (params.per_page) q.set('per_page', String(params.per_page));
  if (params.page)     q.set('page',     String(params.page));

  const res = await fetch(`${BASE}/api/admin/users?${q}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`User list fetch failed: ${res.status}`);
  return res.json();
}
