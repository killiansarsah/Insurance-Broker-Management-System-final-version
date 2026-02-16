import { mockLeads } from '@/mock/leads';
import LeadDetailClient from './client-page';

export async function generateStaticParams() {
    return mockLeads.map((lead) => ({
        id: lead.id,
    }));
}

export default function Page() {
    return <LeadDetailClient />;
}
