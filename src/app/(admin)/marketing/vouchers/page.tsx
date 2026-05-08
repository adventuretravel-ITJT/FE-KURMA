import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Ticket } from 'lucide-react';

export default function VouchersPage() {
  return (
    <PagePlaceholder
      icon={Ticket}
      title="Vouchers & Promo Codes"
      description="Buat kode diskon, atur potongan harga, dan masa kedaluwarsa kupon"
      module="7 — Marketing Tools / Vouchers"
    />
  );
}
