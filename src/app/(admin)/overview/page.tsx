import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { LayoutDashboard } from 'lucide-react';

export default function OverviewPage() {
  return (
    <PagePlaceholder
      icon={LayoutDashboard}
      title="Overview"
      description="Helicopter view kesehatan bisnis Kurma.Guide — stats, charts, dan activity log"
      module="1 — Overview / Home"
    />
  );
}
