import { mockPolicies } from '@/mock/policies';
import PolicyDetailPage from './client-page';

export async function generateStaticParams() {
    return mockPolicies.map((policy) => ({
        id: policy.id,
    }));
}

export default function Page() {
    return <PolicyDetailPage />;
}
