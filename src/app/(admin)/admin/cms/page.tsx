import { redirect } from 'next/navigation';

export default function CmsRoot() {
  redirect('/admin/cms/posts');
}
