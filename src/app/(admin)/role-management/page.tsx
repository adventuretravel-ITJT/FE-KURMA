'use client';

import { useEffect, useState } from 'react';
import RoleList from '@/components/admin/roles/RoleList';
import CreateRoleModal from '@/components/admin/roles/CreateRoleModal';
import { Role, Permission } from '@/types/admin';

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === 'success') setRoles(data.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Gagal memuat data roles. Coba refresh halaman.');
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === 'success') setPermissions(data.data);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError('Gagal memuat data permissions. Coba refresh halaman.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRoles(), fetchPermissions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRoleCreated = () => {
    fetchRoles();
    setIsCreateModalOpen(false);
  };

  const handleRoleUpdated = () => {
    fetchRoles();
  };

  const handleRoleDeleted = () => {
    fetchRoles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-2 border-[var(--kg-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-[var(--kg-coral)] text-sm">{error}</div>
        <button
          onClick={() => { setError(''); setLoading(true); Promise.all([fetchRoles(), fetchPermissions()]).finally(() => setLoading(false)); }}
          className="px-4 py-2 bg-[var(--kg-primary)] text-white rounded-lg font-500 text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-600 text-[var(--kg-ink)]">Role Management</h1>
          <p className="text-sm text-[var(--kg-ink-56)] mt-1">
            Kelola role, permission, dan akses admin ke modul aplikasi
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-[var(--kg-primary)] text-white rounded-lg font-500 text-sm hover:bg-[var(--kg-primary-dark)] transition-colors"
        >
          + Buat Role Baru
        </button>
      </div>

      <RoleList
        roles={roles}
        permissions={permissions}
        onUpdate={handleRoleUpdated}
        onDelete={handleRoleDeleted}
      />

      {isCreateModalOpen && (
        <CreateRoleModal
          permissions={permissions}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleRoleCreated}
        />
      )}
    </div>
  );
}
