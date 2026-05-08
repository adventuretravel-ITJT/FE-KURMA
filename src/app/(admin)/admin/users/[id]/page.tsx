import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { UserCircle } from 'lucide-react';

export default function UserDetailPage() {
  return (
    <PagePlaceholder
      icon={UserCircle}
      title="User Detail"
      description="Trip history, status share, manual premium override, dan internal notes CS"
      module="3 — User Profile Detail"
    />
  );
}
