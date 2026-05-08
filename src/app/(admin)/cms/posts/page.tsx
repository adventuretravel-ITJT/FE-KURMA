import PagePlaceholder from '@/components/admin/PagePlaceholder';
import { BookOpen } from 'lucide-react';

export default function CmsPostsPage() {
  return (
    <PagePlaceholder
      icon={BookOpen}
      title="Blog Posts"
      description="Tulis dan kelola artikel travel — workflow Draft → Review → Published"
      module="6 — CMS Manager / Blog Posts"
    />
  );
}
