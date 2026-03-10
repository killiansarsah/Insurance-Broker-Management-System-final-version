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
    jobTitle: string;
    location: string;

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
            // User defaults — populated from backend on login
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: '',
            avatarUrl: null,
            jobTitle: '',
            location: '',

            // Org defaults — populated from backend on login
            companyName: '',
            companyEmail: '',
            corporatePhone: '',
            mobileNumber: '',
            tin: '',
            street: '',
            city: '',
            region: '',
            gps: '',
            postal: '',
            businessHours: '',
            fiscalYear: '',
            commission: '',
            gracePeriod: '',
            polPrefix: '',
            clmPrefix: '',
            cliPrefix: '',
            ledPrefix: '',
            primaryColor: '#c28532',
            accentColor: '#2563eb',
            logoUrl: null,

            updateProfile: (data) => set((state) => ({ ...state, ...data })),
        }),
        {
            name: 'ibms-profile',
        }
    )
);
