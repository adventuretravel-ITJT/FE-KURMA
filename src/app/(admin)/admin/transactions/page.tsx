import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { CreditCard } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <PagePlaceholder
      icon={CreditCard}
      title="Transaction & Finance"
      description="Payment logs, invoice generator, refund, reconciliation, dan webhook monitor"
      module="10 — Transaction & Finance"
    />
  );
}
