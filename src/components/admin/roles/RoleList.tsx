'use client';

import { Role, Permission } from '@/types/admin';
import RoleRow from './RoleRow';

interface RoleListProps {
  roles: Role[];
  permissions: Permission[];
  onUpdate: () => void;
  onDelete: () => void;
}

export default function RoleList({ roles, permissions, onUpdate, onDelete }: RoleListProps) {
  const defaultRoles = ['superadmin', 'admin', 'user', 'cs', 'editor', 'marketing'];

  // Group permissions by module
  const permissionsByModule = {
    'Overview': permissions.filter(p => p.slug.includes('overview')),
    'User Management': permissions.filter(p => p.slug.includes('users')),
    'Destination': permissions.filter(p => p.slug.includes('destination')),
    'Templates': permissions.filter(p => p.slug.includes('template')),
    'CMS': permissions.filter(p => p.slug.includes('cms')),
    'Marketing': permissions.filter(p => p.slug.includes('marketing')),
    'Affiliate': permissions.filter(p => p.slug.includes('affiliate')),
    'Transactions': permissions.filter(p => p.slug.includes('transaction')),
    'Moderation': permissions.filter(p => p.slug.includes('moderation')),
    'Configuration': permissions.filter(p => p.slug.includes('config')),
    'Admin': permissions.filter(p => p.slug.includes('role') || p.slug.includes('audit')),
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-lg p-4">
          <div className="text-xs font-600 text-[var(--kg-ink-40)] uppercase mb-1">Total Roles</div>
          <div className="text-2xl font-600 text-[var(--kg-ink)]">{roles.length}</div>
        </div>
        <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-lg p-4">
          <div className="text-xs font-600 text-[var(--kg-ink-40)] uppercase mb-1">Default Roles</div>
          <div className="text-2xl font-600 text-[var(--kg-primary)]">{roles.filter(r => defaultRoles.includes(r.slug)).length}</div>
        </div>
        <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-lg p-4">
          <div className="text-xs font-600 text-[var(--kg-ink-40)] uppercase mb-1">Custom Roles</div>
          <div className="text-2xl font-600 text-[var(--kg-primary-bright)]">
            {roles.filter(r => !defaultRoles.includes(r.slug)).length}
          </div>
        </div>
        <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-lg p-4">
          <div className="text-xs font-600 text-[var(--kg-ink-40)] uppercase mb-1">Total Permissions</div>
          <div className="text-2xl font-600 text-[var(--kg-ink)]">{permissions.length}</div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--kg-surface-mist)] border-b border-[var(--kg-hairline-mist)]">
              <tr>
                <th className="px-6 py-3 text-left font-600 text-[var(--kg-ink-72)]">Role Name</th>
                <th className="px-6 py-3 text-left font-600 text-[var(--kg-ink-72)]">Slug</th>
                <th className="px-6 py-3 text-left font-600 text-[var(--kg-ink-72)]">Permissions</th>
                <th className="px-6 py-3 text-left font-600 text-[var(--kg-ink-72)]">Status</th>
                <th className="px-6 py-3 text-right font-600 text-[var(--kg-ink-72)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--kg-hairline)]">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-[var(--kg-ink-56)]">Tidak ada role ditemukan</div>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <RoleRow
                    key={role.id}
                    role={role}
                    permissions={permissions}
                    isDefault={defaultRoles.includes(role.slug)}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Reference */}
      <div className="bg-[var(--kg-surface-mist)] border border-[var(--kg-hairline-mist)] rounded-lg p-6">
        <h3 className="font-600 text-[var(--kg-ink)] mb-4">Permission Reference</h3>
        <div className="grid grid-cols-2 gap-6 text-xs">
          {Object.entries(permissionsByModule).map(([module, perms]) => (
            perms.length > 0 && (
              <div key={module}>
                <div className="font-600 text-[var(--kg-ink-72)] mb-2">{module}</div>
                <ul className="space-y-1 text-[var(--kg-ink-56)]">
                  {perms.map((perm) => (
                    <li key={perm.id} className="flex items-start gap-2">
                      <span className="text-[var(--kg-primary)] mt-0.5">✓</span>
                      <span>{perm.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
