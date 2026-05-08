import { redirect } from 'next/navigation';

export default function SettingsRoot() {
  redirect('/admin/role-management');
}
