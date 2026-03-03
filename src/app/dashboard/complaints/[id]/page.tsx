import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_COMPLAINTS } from '@/mock/documents-complaints';
import ComplaintDetailPage from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const complaint = MOCK_COMPLAINTS.find((c) => c.id === id);
    if (!complaint) return { title: 'Complaint not found' };
    return {
        title: complaint.subject,
        description: `Complaint from ${complaint.complainantName}: ${complaint.subject}.`,
        openGraph: {
            title: complaint.subject,
            description: `Complaint from ${complaint.complainantName}: ${complaint.subject}.`,
            type: 'article',
        },
        alternates: { canonical: `/dashboard/complaints/${id}` },
    };
}

// Generate static params for static export
export async function generateStaticParams() {
    return MOCK_COMPLAINTS.map((c) => ({
        id: c.id,
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const complaint = MOCK_COMPLAINTS.find((c) => c.id === id);
    if (!complaint) notFound();
    return <ComplaintDetailPage params={params} />;
}
