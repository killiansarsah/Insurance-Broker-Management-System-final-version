import { claims } from '@/mock/claims';
import ClaimDetailClient from './client-page';

// Generate static params for static export
export async function generateStaticParams() {
    return claims.map((claim) => ({
        id: claim.id,
    }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <ClaimDetailClient params={params} />;
}
