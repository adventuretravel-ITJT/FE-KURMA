import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { LayoutTemplate } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <PagePlaceholder
      icon={LayoutTemplate}
      title="Master Templates"
      description="Buat template itinerary siap pakai — public atau internal untuk klien VVIP"
      module="5 — Master Templates"
    />
  );
}
