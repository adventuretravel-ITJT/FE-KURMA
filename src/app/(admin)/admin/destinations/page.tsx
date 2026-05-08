import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Globe } from 'lucide-react';

export default function DestinationsPage() {
  return (
    <PagePlaceholder
      icon={Globe}
      title="Destination & City Guide"
      description="Kelola negara, kota, weather config, must-eat, dan local tips"
      module="4 — Destination & City Guide"
    />
  );
}
