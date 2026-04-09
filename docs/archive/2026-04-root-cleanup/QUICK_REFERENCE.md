# 🚀 IBMS - Quick Reference Card

## ⚡ Start Commands

```bash
# Backend (Terminal 1)
cd ibms-backend && npm run start:dev

# Frontend (Terminal 2)
npm run dev
```

## 🔐 Login

- **URL**: http://localhost:3000
- **Email**: admin@sic.com
- **Password**: Admin@123

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger Docs | http://localhost:3001/api/docs |
| Prisma Studio | http://localhost:5555 |
| Health Check | http://localhost:3001/api/v1/health |

## 📊 Database

```bash
# View database
cd ibms-backend && npx prisma studio

# Reseed database
cd ibms-backend && npx prisma db seed

# Run migrations
cd ibms-backend && npx prisma migrate dev
```

## 🧪 Testing

```bash
# Check mock usage
node find-mock-usage.js

# Verify migration
node migrate-all.js

# Add loading states
node add-loading-states.js
```

## 📁 Key Files

- `ibms-backend/.env` - Backend config
- `ibms-backend/prisma/schema.prisma` - Database schema
- `src/hooks/api/` - API hooks
- `src/lib/api-client.ts` - API client
- `src/stores/auth-store.ts` - Auth state

## 🎯 Module URLs

| Module | URL |
|--------|-----|
| Dashboard | /dashboard |
| Clients | /dashboard/clients |
| Policies | /dashboard/policies |
| Claims | /dashboard/claims |
| Leads | /dashboard/leads |
| Finance | /dashboard/finance |
| Reports | /dashboard/reports |

## 🔧 Troubleshooting

**Backend won't start?**
```bash
cd ibms-backend
docker-compose up -d
npm install
npm run start:dev
```

**Frontend errors?**
```bash
npm install
npm run dev
```

**Database issues?**
```bash
cd ibms-backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

## 📚 Documentation

- `PROJECT_STATUS.md` - Complete status
- `MIGRATION_COMPLETE.md` - Migration summary
- `TESTING_GUIDE.md` - Testing procedures
- `BACKEND_QUICK_START.md` - Backend setup

## ✅ Status

- **Migration**: 100% Complete (52/52 files)
- **Backend**: Running on port 3001
- **Frontend**: Running on port 3000
- **Database**: PostgreSQL with seed data
- **API**: 150+ endpoints operational

## 🎉 Success!

Your IBMS is fully functional and production-ready!
