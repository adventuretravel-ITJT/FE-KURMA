import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Handshake } from 'lucide-react';

export default function AffiliatesPage() {
  return (
    <PagePlaceholder
      icon={Handshake}
      title="Affiliate Manager"
      description="Performa afiliator, link & code generator, dan commission payout tracker"
      module="8 — Affiliate Manager"
    />
  );
}
