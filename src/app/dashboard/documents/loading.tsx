import { AppLoader } from '@/components/ui/AppLoader';

export default function Loading() {
    return <AppLoader message="Loading documents..." isLoading={true} />;
}
