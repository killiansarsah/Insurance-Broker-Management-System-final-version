import { redirect } from 'next/navigation';

// The standalone Commissions page has been consolidated under Finance.
// Redirect all existing links to the new location.
export default function CommissionsRedirectPage() {
    redirect('/dashboard/finance/commissions');
}
