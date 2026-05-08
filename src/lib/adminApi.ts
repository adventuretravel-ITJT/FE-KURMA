const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function authHeaders(): HeadersInit {
  if (typeof document === 'undefined') return {};
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
  return token ? { Authorization: `Bearer ${token}` } : {};
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
