import { AppLoader } from '@/components/ui/AppLoader';

export default function Loading() {
    return <AppLoader message="Loading carrier details..." isLoading={true} />;
}
