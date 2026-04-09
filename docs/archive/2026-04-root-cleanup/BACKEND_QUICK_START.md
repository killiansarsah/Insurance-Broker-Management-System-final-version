# IBMS Backend - Quick Start Guide

## ✅ Backend Status: RUNNING

Your backend is successfully running on **http://localhost:3001**

---

## 🔐 Login Credentials

### Admin Accounts (Password: `Admin@123`)

**SIC Insurance:**
- Email: `admin@sic.com`
- Tenant: SIC Insurance

**Enterprise Insurance:**
- Email: `admin@enterprise.com`
- Tenant: Enterprise Insurance

---

## 🌐 Access Points

| Service | URL |
|---------|-----|
| API Base | http://localhost:3001/api/v1 |
| Swagger Docs | http://localhost:3001/api/docs |
| Health Check | http://localhost:3001/api/v1/health |
| Prisma Studio | Run `npx prisma studio` (opens on port 5555) |

---

## 📊 Database Status

✅ **Seeded Data:**
- 2 Tenants
- 2 Admin Users
- 6 Branches (3 per tenant)
- 10 Carriers (5 per tenant)
- 30 Products (3 per carrier)

---

## 🚀 Common Commands

### Start Backend (if stopped)
```bash
cd ibms-backend
npm run start:dev
```

### View Database
```bash
cd ibms-backend
npx prisma studio
```

### Reseed Database
```bash
cd ibms-backend
npx prisma db seed
```

### Check Database Status
```bash
cd ibms-backend
node check-db.js
```

---

## 🧪 Test the API

### Using Browser
Visit: http://localhost:3001/api/docs

### Using PowerShell
```powershell
# Test login
$body = @{
    email = "admin@sic.com"
    password = "Admin@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
```

---

## 📝 Next Steps

1. ✅ Backend is running
2. ✅ Database is seeded
3. ⏳ **Connect Frontend** (Phase 11)
   - Update frontend `.env.local` with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
     NEXT_PUBLIC_WS_URL=ws://localhost:3001
     ```
   - Replace mock data with real API calls

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check if port 3001 is available
- Ensure PostgreSQL is running (Docker)
- Check `.env` file exists

**Database connection error?**
- Start Docker: `docker-compose up -d`
- Check DATABASE_URL in `.env`

**Prisma Studio error?**
- Stop the backend server first
- Or run in a separate terminal
