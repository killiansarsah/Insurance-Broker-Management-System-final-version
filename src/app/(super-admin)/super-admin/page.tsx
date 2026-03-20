import { redirect } from 'next/navigation';

export default function SuperAdminIndex() {
  // Directly redirect the root /super-admin to the overview page
  redirect('/super-admin/overview');
}
