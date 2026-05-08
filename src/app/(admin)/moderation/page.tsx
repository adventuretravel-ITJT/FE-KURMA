import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { Shield } from 'lucide-react';

export default function ModerationPage() {
  return (
    <PagePlaceholder
      icon={Shield}
      title="Moderation & Reported Content"
      description="Report inbox dan ban/takedown link shared itinerary yang dilaporkan"
      module="11 — Moderation & Reported Content"
    />
  );
}
