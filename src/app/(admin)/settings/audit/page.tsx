import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { ClipboardList } from 'lucide-react';

export default function AuditPage() {
  return (
    <PagePlaceholder
      icon={ClipboardList}
      title="System Audit Log"
      description="Riwayat aktivitas admin — timestamp, actor, IP, action type, dan payload perubahan"
      module="9 — Settings / Audit Log"
    />
  );
}
