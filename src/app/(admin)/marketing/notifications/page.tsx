import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <PagePlaceholder
      icon={Bell}
      title="Notification & Nudge Center"
      description="Blast email, push notification, dan in-app banner ke segmen user tertentu"
      module="7 — Marketing Tools / Notifications"
    />
  );
}
