'use client';

import { Permission } from '@/types/admin';
import { useMemo, useRef, useEffect } from 'react';

function GroupCheckbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate: boolean; onChange: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded cursor-pointer"
    />
  );
}

interface PermissionSelectorProps {
  permissions: Permission[];
  selectedPermissions: number[];
  onChange: (selectedIds: number[]) => void;
}

export default function PermissionSelector({
  permissions,
  selectedPermissions,
  onChange,
}: PermissionSelectorProps) {
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {
      'Overview & Dashboard': [],
      'User Management': [],
      'Destination & City Guide': [],
      'Templates': [],
      'CMS': [],
      'Marketing & Growth': [],
      'Affiliate': [],
      'Transactions & Finance': [],
      'Moderation & Safety': [],
      'Configuration': [],
      'Admin & Access': [],
    };

    permissions.forEach((perm) => {
      if (perm.slug.includes('overview')) groups['Overview & Dashboard'].push(perm);
      else if (perm.slug.includes('users')) groups['User Management'].push(perm);
      else if (perm.slug.includes('destination')) groups['Destination & City Guide'].push(perm);
      else if (perm.slug.includes('template')) groups['Templates'].push(perm);
      else if (perm.slug.includes('cms') || perm.slug.includes('approve')) groups['CMS'].push(perm);
      else if (perm.slug.includes('marketing')) groups['Marketing & Growth'].push(perm);
      else if (perm.slug.includes('affiliate')) groups['Affiliate'].push(perm);
      else if (perm.slug.includes('transaction')) groups['Transactions & Finance'].push(perm);
      else if (perm.slug.includes('moderation')) groups['Moderation & Safety'].push(perm);
      else if (perm.slug.includes('config')) groups['Configuration'].push(perm);
      else if (perm.slug.includes('role') || perm.slug.includes('audit')) groups['Admin & Access'].push(perm);
    });

    return Object.entries(groups).filter(([_, perms]) => perms.length > 0);
  }, [permissions]);

  const togglePermission = (permId: number) => {
    if (selectedPermissions.includes(permId)) {
      onChange(selectedPermissions.filter((id) => id !== permId));
    } else {
      onChange([...selectedPermissions, permId]);
    }
  };

  const toggleAllInGroup = (groupPerms: Permission[]) => {
    const allSelected = groupPerms.every((p) => selectedPermissions.includes(p.id));
    if (allSelected) {
      onChange(selectedPermissions.filter((id) => !groupPerms.map((p) => p.id).includes(id)));
    } else {
      const newIds = [...new Set([...selectedPermissions, ...groupPerms.map((p) => p.id)])];
      onChange(newIds);
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {groupedPermissions.map(([group, perms]) => {
        const groupAllSelected = perms.every((p) => selectedPermissions.includes(p.id));
        const groupSomeSelected = perms.some((p) => selectedPermissions.includes(p.id));

        return (
          <div key={group} className="border border-[var(--kg-hairline)] rounded-lg p-4">
            <div className="mb-3">
              <button
                type="button"
                onClick={() => toggleAllInGroup(perms)}
                className="flex items-center gap-2 font-500 text-sm text-[var(--kg-ink)] hover:text-[var(--kg-primary)] transition-colors"
              >
                <GroupCheckbox
                  checked={groupAllSelected}
                  indeterminate={groupSomeSelected && !groupAllSelected}
                  onChange={() => toggleAllInGroup(perms)}
                />
                {group}
                <span className="text-xs text-[var(--kg-ink-56)] ml-auto">
                  {perms.filter((p) => selectedPermissions.includes(p.id)).length} / {perms.length}
                </span>
              </button>
            </div>

            <div className="space-y-2 ml-6">
              {perms.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-start gap-2 cursor-pointer hover:bg-[var(--kg-canvas)] p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="w-4 h-4 rounded mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-500 text-[var(--kg-ink)]">{perm.name}</div>
                    {perm.description && (
                      <div className="text-xs text-[var(--kg-ink-56)] mt-0.5">{perm.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
