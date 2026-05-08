import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { SlidersHorizontal } from 'lucide-react';

export default function ConfigPage() {
  return (
    <PagePlaceholder
      icon={SlidersHorizontal}
      title="Global Configuration"
      description="Storage limits, ukuran maksimal upload, dan pengaturan global aplikasi"
      module="12 — Global Configuration"
    />
  );
}
