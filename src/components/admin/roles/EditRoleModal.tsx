'use client';

import { useState, useEffect } from 'react';
import { Role, Permission } from '@/types/admin';
import PermissionSelector from './PermissionSelector';

interface EditRoleModalProps {
  role: Role;
  permissions: Permission[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRoleModal({ role, permissions, onClose, onSuccess }: EditRoleModalProps) {
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description || '',
  });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    role.permissions?.map(p => p.id) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Nama role tidak boleh kosong');
      return;
    }

    setLoading(true);

    try {
      // Update role info
      const res1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${role.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res1.ok) {
        const data = await res1.json();
        setError(data.message || 'Gagal mengupdate role');
        setLoading(false);
        return;
      }

      // Update permissions
      const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${role.id}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ permission_ids: selectedPermissions }),
      });

      if (!res2.ok) {
        const data = await res2.json();
        setError(data.message || 'Gagal mengupdate permissions');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Terjadi kesalahan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--kg-paper)] rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[var(--kg-hairline)]">
          <h2 className="text-lg font-600 text-[var(--kg-ink)]">Edit Role: {role.name}</h2>
          <p className="text-sm text-[var(--kg-ink-56)] mt-1">
            Update informasi dan permission role ini
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-[var(--kg-coral-soft)] border border-[var(--kg-coral)] rounded-lg text-sm text-[var(--kg-coral)]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-500 text-[var(--kg-ink)] mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--kg-hairline)] rounded-lg text-sm focus:border-[var(--kg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kg-focus-ring)]"
              />
            </div>

            <div>
              <label className="block text-sm font-500 text-[var(--kg-ink)] mb-2">
                Slug
              </label>
              <input
                type="text"
                value={role.slug}
                disabled
                className="w-full px-4 py-2 border border-[var(--kg-hairline)] rounded-lg text-sm font-mono bg-[var(--kg-canvas)] cursor-not-allowed opacity-75"
              />
              <p className="text-xs text-[var(--kg-ink-56)] mt-1">Slug tidak bisa diubah</p>
            </div>

            <div>
              <label className="block text-sm font-500 text-[var(--kg-ink)] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--kg-hairline)] rounded-lg text-sm focus:border-[var(--kg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kg-focus-ring)] resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="border-t border-[var(--kg-hairline)] pt-6">
            <label className="block text-sm font-500 text-[var(--kg-ink)] mb-4">
              Permissions ({selectedPermissions.length} selected)
            </label>
            <PermissionSelector
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          </div>

          <div className="flex gap-3 justify-end border-t border-[var(--kg-hairline)] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-500 text-[var(--kg-ink-72)] hover:bg-[var(--kg-canvas)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-500 text-white bg-[var(--kg-primary)] hover:bg-[var(--kg-primary-bright)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
