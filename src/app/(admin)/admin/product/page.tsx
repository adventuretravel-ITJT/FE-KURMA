import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Settings2 } from 'lucide-react';

export default function ProductPage() {
  return (
    <PagePlaceholder
      icon={Settings2}
      title="Product & Core Configuration"
      description="Subscription tier, API integrations, dan maintenance mode toggle"
      module="2 — Product / Core Configuration"
    />
  );
}
