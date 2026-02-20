import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
    // User profile
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    avatarUrl: string | null;

    // Organization
    companyName: string;
    companyEmail: string;
    corporatePhone: string;
    mobileNumber: string;
    tin: string;
    street: string;
    city: string;
    region: string;
    gps: string;
    postal: string;
    businessHours: string;
    fiscalYear: string;
    commission: string;
    gracePeriod: string;
    polPrefix: string;
    clmPrefix: string;
    cliPrefix: string;
    ledPrefix: string;
    primaryColor: string;
    accentColor: string;
    logoUrl: string | null;

    // Actions
    updateProfile: (data: Partial<Omit<ProfileState, 'updateProfile' | 'updateOrg'>>) => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            // User defaults
            firstName: 'Kwame',
            lastName: 'Asante',
            email: 'kwame@asante-brokerage.com',
            phone: '+233 24 123 4567',
            bio: 'Experienced insurance broker with over 15 years in the Ghanaian market, specializing in corporate risk and motor insurance.',
            avatarUrl: null,

            // Org defaults
            companyName: 'Asante & Sons Brokerage',
            companyEmail: 'info@asante-brokerage.com',
            corporatePhone: '+233 30 225 1234',
            mobileNumber: '+233 24 123 4567',
            tin: 'C0012345678',
            street: '14 Independence Avenue',
            city: 'Accra',
            region: 'Greater Accra',
            gps: 'GA-125-7894',
            postal: 'P.O. Box AN 1234, Accra North',
            businessHours: '08:00 AM – 05:00 PM',
            fiscalYear: 'January 1',
            commission: '15',
            gracePeriod: '30',
            polPrefix: 'ASB-POL-',
            clmPrefix: 'ASB-CLM-',
            cliPrefix: 'ASB-CLI-',
            ledPrefix: 'ASB-LED-',
            primaryColor: '#c28532',
            accentColor: '#2563eb',
            logoUrl: null,

            updateProfile: (data) => set((state) => ({ ...state, ...data })),
        }),
        {
            name: 'ibms-profile',
            // Blob URLs (from URL.createObjectURL) are ephemeral and die on page reload.
            // Exclude them from persistence so we never restore a dead blob: URL.
            partialize: (state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { avatarUrl, logoUrl, ...rest } = state;
                return rest;
            },
        }
    )
);
