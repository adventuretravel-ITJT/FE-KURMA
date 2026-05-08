import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Images } from 'lucide-react';

export default function CmsMediaPage() {
  return (
    <PagePlaceholder
      icon={Images}
      title="Media Library"
      description="Penyimpanan internal semua foto hero, ikon, dan aset grafis"
      module="6 — CMS Manager / Media Library"
    />
  );
}
