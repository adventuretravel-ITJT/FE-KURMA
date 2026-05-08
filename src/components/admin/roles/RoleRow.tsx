'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Role, Permission } from '@/types/admin';
import EditRoleModal from './EditRoleModal';
import ConfirmModal from '@/components/itinerary/ConfirmModal';

interface RoleRowProps {
  role: Role;
  permissions: Permission[];
  isDefault: boolean;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function RoleRow({ role, permissions, isDefault, onUpdate, onDelete }: RoleRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    setDeleteError('');
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${role.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        onDelete();
      } else {
        const data = await res.json();
        setDeleteError(data.message || 'Gagal menghapus role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setDeleteError('Terjadi kesalahan saat menghapus role');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-[var(--kg-surface-mist)] transition-colors">
        <td className="px-6 py-4">
          <div>
            <div className="font-500 text-[var(--kg-ink)]">{role.name}</div>
            {role.description && (
              <div className="text-xs text-[var(--kg-ink-56)] mt-1">{role.description}</div>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <code className="text-xs bg-[var(--kg-canvas)] text-[var(--kg-ink)] px-2 py-1 rounded font-mono">
            {role.slug}
          </code>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-600 text-[var(--kg-ink)]">{role.permissions?.length || 0}</span>
            <span className="text-xs text-[var(--kg-ink-56)]">permissions</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-500 ${
            isDefault
              ? 'bg-[var(--kg-surface-mist)] text-[var(--kg-primary)]'
              : 'bg-[var(--kg-canvas)] text-[var(--kg-ink-72)]'
          }`}>
            {isDefault ? 'Default' : 'Custom'}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              disabled={isDefault && ['superadmin', 'admin', 'user'].includes(role.slug)}
              className="px-3 py-1.5 text-xs font-500 text-[var(--kg-primary)] hover:bg-[var(--kg-surface-mist)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isDefault && ['superadmin', 'admin', 'user'].includes(role.slug) ? 'Role default tidak bisa diedit' : 'Edit role'}
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDefault || isDeleting}
              className="px-3 py-1.5 text-xs font-500 text-[var(--kg-coral)] hover:bg-[var(--kg-coral-soft)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isDefault ? 'Role default tidak bisa dihapus' : 'Hapus role'}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </td>
      </tr>

      {isEditOpen && createPortal(
        <EditRoleModal
          role={role}
          permissions={permissions}
          onClose={() => setIsEditOpen(false)}
          onSuccess={onUpdate}
        />,
        document.body
      )}

      {showConfirm && createPortal(
        <ConfirmModal
          title={`Hapus role "${role.name}"?`}
          sub="Tindakan ini tidak bisa dibatalkan."
          confirmLabel={isDeleting ? 'Menghapus...' : 'Hapus'}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />,
        document.body
      )}

      {deleteError && createPortal(
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-[var(--kg-coral-soft)] border border-[var(--kg-coral)] rounded-lg text-sm text-[var(--kg-coral)] shadow-lg">
          {deleteError}
          <button onClick={() => setDeleteError('')} className="ml-3 font-600 hover:opacity-70">✕</button>
        </div>,
        document.body
      )}
    </>
  );
}
