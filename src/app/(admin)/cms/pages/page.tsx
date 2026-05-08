import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { FileStack } from 'lucide-react';

export default function CmsPagesPage() {
  return (
    <PagePlaceholder
      icon={FileStack}
      title="Static Pages"
      description="Buat landing page promo tanpa bantuan IT — pilih layout, ganti teks & gambar"
      module="6 — CMS Manager / Static Pages"
    />
  );
}
