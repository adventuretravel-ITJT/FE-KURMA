'use client';

import { useState } from 'react';
import { Permission } from '@/types/admin';
import PermissionSelector from './PermissionSelector';

interface CreateRoleModalProps {
  permissions: Permission[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoleModal({ permissions, onClose, onSuccess }: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          permission_ids: selectedPermissions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal membuat role');
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
          <h2 className="text-lg font-600 text-[var(--kg-ink)]">Buat Role Baru</h2>
          <p className="text-sm text-[var(--kg-ink-56)] mt-1">
            Role custom tidak boleh memiliki permission lebih dari Super Admin
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
                Role Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Senior Editor"
                className="w-full px-4 py-2 border border-[var(--kg-hairline)] rounded-lg text-sm focus:border-[var(--kg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kg-focus-ring)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-500 text-[var(--kg-ink)] mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g., senior-editor"
                className="w-full px-4 py-2 border border-[var(--kg-hairline)] rounded-lg text-sm font-mono focus:border-[var(--kg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kg-focus-ring)]"
                required
              />
              <p className="text-xs text-[var(--kg-ink-56)] mt-1">Slug hanya boleh huruf kecil, angka, dan dash</p>
            </div>

            <div>
              <label className="block text-sm font-500 text-[var(--kg-ink)] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi role..."
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
              disabled={loading || !formData.name || !formData.slug}
              className="px-4 py-2 text-sm font-500 text-white bg-[var(--kg-primary)] hover:bg-[var(--kg-primary-bright)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
