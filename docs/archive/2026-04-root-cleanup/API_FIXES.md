# API Error Fixes

## Issues Identified

### 1. 401 Unauthorized - `/api/v1/settings`
**Cause**: Missing or invalid JWT token in request headers.

**Solution**: Ensure the user is logged in and the access token is being sent correctly.

**Frontend Check**:
```typescript
// In your auth store, verify the token is being set after login
apiClient.setAccessToken(accessToken);
```

### 2. 400 Bad Request - `/api/v1/invitations`
**Cause**: The `role` field must be a valid `UserRole` enum value from Prisma.

**Valid Role Values**:
- `ADMIN`
- `TENANT_ADMIN`
- `BROKER`
- `VIEWER`

**Frontend Fix Required**:
Update `src/hooks/api/use-invitations.ts`:
```typescript
export function useCreateInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { 
            email: string; 
            role: 'ADMIN' | 'TENANT_ADMIN' | 'BROKER' | 'VIEWER'; 
            branchId?: string 
        }) => apiClient.post('/invitations', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}
```

### 3. 400 Bad Request - `/api/v1/settings/upload-avatar`
**Cause**: The file upload might be failing due to:
- File size exceeding 5MB limit
- Invalid file type (must be JPEG, PNG, GIF, or WebP)
- Missing file in the request

**Backend Configuration** (Already correct):
- Max file size: 5MB
- Allowed types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Field name: `file`

**Frontend Check**:
Verify the file is being sent correctly in `settings-profile.tsx`:
```typescript
const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
    }
    
    try {
        await uploadAvatar.mutateAsync(file);
        toast.success('Avatar updated successfully');
    } catch (error) {
        toast.error('Failed to upload avatar');
    }
};
```

## Quick Fixes

### Fix 1: Update Invitations Hook
```bash
# File: src/hooks/api/use-invitations.ts
```

Replace the entire file with:
```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type UserRole = 'ADMIN' | 'TENANT_ADMIN' | 'BROKER' | 'VIEWER';

export function useCreateInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { email: string; role: UserRole; branchId?: string }) =>
            apiClient.post('/invitations', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}
```

### Fix 2: Add Missing Renewals Endpoint

Create or update the renewals controller in your backend:

```typescript
// File: ibms-backend/src/renewals/renewals.controller.ts

@Get('upcoming')
@Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
async getUpcomingRenewals(
  @Query('daysAhead') daysAhead: string = '90',
  @CurrentUser() user: AuthenticatedUser,
) {
  const days = parseInt(daysAhead, 10) || 90;
  return this.renewalsService.getUpcomingRenewals(user.tenantId, days);
}
```

Add the service method:
```typescript
// File: ibms-backend/src/renewals/renewals.service.ts

async getUpcomingRenewals(tenantId: string, daysAhead: number) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return this.prisma.policy.findMany({
    where: {
      tenantId,
      status: 'ACTIVE',
      endDate: {
        gte: new Date(),
        lte: futureDate,
      },
    },
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      carrier: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      endDate: 'asc',
    },
  });
}
```

## Testing

After applying fixes, test each endpoint:

1. **Settings**: Navigate to Settings page while logged in
2. **Invitations**: Try creating a new user invitation
3. **Avatar Upload**: Upload a profile picture (< 5MB, valid image format)
4. **Renewals**: Check the dashboard for upcoming renewals widget

## Common Issues

### Token Not Being Sent
If you see 401 errors, check:
```typescript
// In your auth store after login:
const { accessToken } = response.data;
apiClient.setAccessToken(accessToken);
localStorage.setItem('accessToken', accessToken); // Optional persistence
```

### CORS Issues
Ensure your backend `.env` has:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

### File Upload Issues
Check the `uploads/` directory exists:
```bash
mkdir -p ibms-backend/uploads
```

Add to `.gitignore`:
```
uploads/*
!uploads/.gitkeep
```
