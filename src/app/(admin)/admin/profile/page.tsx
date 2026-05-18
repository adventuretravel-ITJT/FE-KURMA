'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Shield, Lock, Mail, Calendar, Hash,
  CheckCircle, Eye, EyeOff, Pencil,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';

const API = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  return typeof window !== 'undefined'
    ? localStorage.getItem('token') ?? document.cookie.match(/token=([^;]+)/)?.[1] ?? null
    : null;
}
function authHeaders(): Record<string, string> {
  const t = getToken();
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

interface Permission { id: number; name: string; slug: string; }
interface Role { id: number; name: string; slug: string; permissions: Permission[]; }
interface AdminUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  role: Role | null;
}

const ROLE_CONFIG: Record<string, { label: string; bg: string; color: string; desc: string }> = {
  superadmin: { label: 'Super Admin', bg: '#F3E8FF', color: '#7C3AED', desc: 'Full system access — all permissions' },
  admin:      { label: 'Admin',       bg: '#EBF5FF', color: '#1D4ED8', desc: 'Platform administration & user management' },
  cs:         { label: 'CS',          bg: '#ECFDF5', color: '#059669', desc: 'Customer support & trip moderation' },
  editor:     { label: 'Editor',      bg: '#FFF7ED', color: '#C2410C', desc: 'Content management & CMS' },
  marketing:  { label: 'Marketing',   bg: '#FDF2F8', color: '#9D174D', desc: 'Marketing tools & promotions' },
};

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminProfilePage() {
  const router = useRouter();

  const [user, setUser]       = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit profile
  const [editing, setEditing]     = useState(false);
  const [editName, setEditName]   = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');

  // Change password
  const [pw, setPw]               = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState('');
  const [pwDone, setPwDone]       = useState(false);

  useEffect(() => {
    fetch(`${API}/api/me`, { headers: authHeaders() })
      .then(r => r.json())
      .then((d: AdminUser) => {
        setUser(d);
        setEditName(d.name);
        setEditEmail(d.email);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile() {
    if (!editName.trim()) return;
    setSaving(true); setSaveError('');
    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ name: editName.trim(), email: editEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update gagal');
      setUser(data.data);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setPwError('Password baru tidak cocok'); return; }
    setPwSaving(true); setPwError('');
    try {
      const res = await fetch(`${API}/api/change-password`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ current_password: pw.current, new_password: pw.next, new_password_confirm: pw.confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengganti password');
      setPwDone(true);
      setTimeout(() => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; max-age=0';
        router.push('/auth');
      }, 2500);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Gagal mengganti password');
    } finally {
      setPwSaving(false);
    }
  }

  const role    = user?.role;
  const roleCfg = role ? (ROLE_CONFIG[role.slug] ?? { label: role.name, bg: '#f4f6f8', color: '#616161', desc: '' }) : null;

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ height: 28, width: 200, background: '#f4f6f8', borderRadius: 8, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
          {[260, 340].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f4f6f8', borderRadius: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff', border: '1px solid #e1e3e5', borderRadius: 14,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em',
    textTransform: 'uppercase', color: '#8a8a8a',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #e1e3e5',
    borderRadius: 8, fontSize: 13, outline: 'none', color: '#1a1a1a',
    boxSizing: 'border-box', background: '#fff',
  };

  return (
    <div style={{ padding: 32, maxWidth: 980, margin: '0 auto' }}>
      <PageHeader
        icon={<User size={20} />}
        title="My Profile"
        description="Account details, role, and security settings"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Identity card */}
          <div style={{ ...cardStyle, padding: '28px 20px 22px', textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              margin: '0 auto 16px',
              background: roleCfg?.bg ?? '#EBF5FF',
              border: `3px solid ${roleCfg?.color ?? '#2c6ecb'}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700,
              color: roleCfg?.color ?? '#2c6ecb',
              letterSpacing: '-0.5px', userSelect: 'none',
            }}>
              {user ? initials(user.name) : '?'}
            </div>

            {editing ? (
              <div style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: 5 }}>Nama</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: 5 }}>Email</label>
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" style={inputStyle} />
                </div>
                {saveError && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 8 }}>{saveError}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleSaveProfile} disabled={saving}
                    style={{ flex: 1, padding: '8px', background: '#2c6ecb', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: saving ? .7 : 1 }}
                  >
                    {saving ? 'Menyimpan…' : 'Simpan'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setSaveError(''); setEditName(user?.name ?? ''); setEditEmail(user?.email ?? ''); }}
                    style={{ flex: 1, padding: '8px', background: '#f4f6f8', border: '1px solid #e1e3e5', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#616161', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.3px' }}>{user?.name}</p>
                <p style={{ fontSize: 12.5, color: '#8a8a8a', marginTop: 3, marginBottom: 12 }}>{user?.email}</p>

                {roleCfg && (
                  <span style={{
                    display: 'inline-block', padding: '4px 14px', borderRadius: 20,
                    fontSize: 11.5, fontWeight: 700,
                    background: roleCfg.bg, color: roleCfg.color, marginBottom: 12,
                  }}>
                    {roleCfg.label}
                  </span>
                )}

                {user?.email_verified_at && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11.5, color: '#008060', marginBottom: 14 }}>
                    <CheckCircle size={12} /> Email terverifikasi
                  </div>
                )}

                <button
                  onClick={() => setEditing(true)}
                  style={{
                    width: '100%', padding: '8px', border: '1px solid #e1e3e5', borderRadius: 8,
                    fontSize: 12.5, fontWeight: 600, color: '#616161', background: '#f4f6f8',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Pencil size={12} /> Edit Profil
                </button>
              </>
            )}
          </div>

          {/* Account meta */}
          <div style={{ ...cardStyle, padding: '16px 20px' }}>
            <p style={{ ...labelStyle, marginBottom: 12 }}>Info Akun</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: <Hash size={12} />,      label: 'User ID',      value: `#${user?.id}` },
                { icon: <Calendar size={12} />,  label: 'Bergabung',    value: user?.created_at ? fmtDate(user.created_at) : '—' },
                { icon: <Mail size={12} />,      label: 'Login via',    value: 'Email & Password' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: '#8a8a8a', marginTop: 2 }}>{row.icon}</span>
                  <div>
                    <p style={{ fontSize: 10.5, color: '#8a8a8a', fontWeight: 600, letterSpacing: '.04em' }}>{row.label}</p>
                    <p style={{ fontSize: 12.5, color: '#1a1a1a', fontWeight: 500, marginTop: 1 }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Role & Permissions */}
          <div style={{ ...cardStyle, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Shield size={15} color="#616161" />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Role & Permissions</p>
            </div>

            {roleCfg && role && (
              <div style={{
                background: roleCfg.bg,
                border: `1px solid ${roleCfg.color}25`,
                borderRadius: 10, padding: '12px 16px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#fff', border: `1.5px solid ${roleCfg.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Shield size={18} color={roleCfg.color} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: roleCfg.color }}>{roleCfg.label}</p>
                  <p style={{ fontSize: 12, color: roleCfg.color, opacity: .75, marginTop: 2 }}>{roleCfg.desc}</p>
                </div>
              </div>
            )}

            {role?.permissions && role.permissions.length > 0 ? (
              <>
                <p style={{ ...labelStyle, marginBottom: 10 }}>
                  Permissions ({role.permissions.length})
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {role.permissions.map(p => (
                    <span
                      key={p.id}
                      style={{
                        padding: '3px 10px', background: '#f4f6f8',
                        border: '1px solid #e1e3e5', borderRadius: 20,
                        fontSize: 11.5, fontWeight: 500, color: '#616161',
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 12.5, color: '#8a8a8a' }}>Belum ada permission yang ditetapkan.</p>
            )}
          </div>

          {/* Change Password */}
          <div style={{ ...cardStyle, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Lock size={15} color="#616161" />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Ganti Password</p>
            </div>

            {pwDone ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', background: '#ECFDF5',
                border: '1px solid #6EE7B7', borderRadius: 10,
              }}>
                <CheckCircle size={20} color="#059669" />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>Password berhasil diubah!</p>
                  <p style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>Mengarahkan ke halaman login…</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePw}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Current password */}
                  <div>
                    <label style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Password Saat Ini</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={pw.current}
                        onChange={e => setPw(f => ({ ...f, current: e.target.value }))}
                        required
                        style={{ ...inputStyle, paddingRight: 38 }}
                      />
                      <button
                        type="button" onClick={() => setShowCurrent(v => !v)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a8a', padding: 2, display: 'flex' }}
                      >
                        {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {/* New password */}
                    <div>
                      <label style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Password Baru</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNext ? 'text' : 'password'}
                          value={pw.next}
                          onChange={e => setPw(f => ({ ...f, next: e.target.value }))}
                          required minLength={6}
                          style={{ ...inputStyle, paddingRight: 38 }}
                        />
                        <button
                          type="button" onClick={() => setShowNext(v => !v)}
                          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a8a', padding: 2, display: 'flex' }}
                        >
                          {showNext ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm */}
                    <div>
                      <label style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Konfirmasi Password</label>
                      <input
                        type="password"
                        value={pw.confirm}
                        onChange={e => setPw(f => ({ ...f, confirm: e.target.value }))}
                        required
                        style={{
                          ...inputStyle,
                          borderColor: pw.confirm && pw.confirm !== pw.next ? '#DC2626' : '#e1e3e5',
                        }}
                      />
                    </div>
                  </div>

                  {pwError && <p style={{ fontSize: 12, color: '#DC2626' }}>{pwError}</p>}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <p style={{ fontSize: 11.5, color: '#8a8a8a', lineHeight: 1.5 }}>
                      Min. 6 karakter · Akan logout otomatis setelah berhasil
                    </p>
                    <button
                      type="submit" disabled={pwSaving}
                      style={{
                        padding: '9px 22px', background: '#1a1a1a', border: 'none',
                        borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff',
                        cursor: pwSaving ? 'wait' : 'pointer', opacity: pwSaving ? .7 : 1,
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      {pwSaving ? 'Menyimpan…' : 'Ganti Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
