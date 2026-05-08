import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <PagePlaceholder
      icon={Users}
      title="User Management"
      description="Kelola semua user — filter, batch action, profile detail, manual premium override"
      module="3 — User Management"
    />
  );
}
