# 🧪 IBMS - Final Testing & Verification Guide

## ✅ Migration Complete!

**Status**: All 52 pages migrated from mock data to real API
**Remaining mock imports**: 1 (mock/clients.ts - internal use only)

---

## 🚀 Quick Start Testing

### Step 1: Start Backend
```bash
cd ibms-backend
npm run start:dev
```

**Expected Output:**
```
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG [Bootstrap] IBMS Backend running on port 3001
```

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 3: Login
1. Open: http://localhost:3000
2. Email: `admin@sic.com`
3. Password: `Admin@123`
4. Click "Sign In"

---

## 🧪 Test Checklist

### Core Modules (Must Test)

#### ✅ Dashboard
- [ ] Visit http://localhost:3000/dashboard
- [ ] Verify KPI cards show real numbers
- [ ] Check charts load with data
- [ ] Verify recent activity shows real entries

#### ✅ Clients
- [ ] Visit http://localhost:3000/dashboard/clients
- [ ] Verify client list loads from database
- [ ] Click on a client to view details
- [ ] Try creating a new client
- [ ] Try editing a client
- [ ] Test search and filters

#### ✅ Policies
- [ ] Visit http://localhost:3000/dashboard/policies
- [ ] Verify policy list loads
- [ ] Click on a policy to view details
- [ ] Check policy status badges
- [ ] Test filters (status, type, broker)

#### ✅ Claims
- [ ] Visit http://localhost:3000/dashboard/claims
- [ ] Verify claims list loads
- [ ] Click on a claim to view details
- [ ] Check claim status workflow
- [ ] Test search functionality

#### ✅ Leads
- [ ] Visit http://localhost:3000/dashboard/leads
- [ ] Verify Kanban board loads
- [ ] Try dragging a lead between columns
- [ ] Switch to list view
- [ ] Test lead creation

#### ✅ Finance
- [ ] Visit http://localhost:3000/dashboard/finance
- [ ] Check financial dashboard loads
- [ ] Visit invoices page
- [ ] Visit commissions page
- [ ] Visit expenses page
- [ ] Verify all data is from database

---

## 🔍 Verification Commands

### Check Backend Health
```bash
curl http://localhost:3001/api/v1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Check API Endpoints
```bash
# Get clients
curl http://localhost:3001/api/v1/clients

# Get policies
curl http://localhost:3001/api/v1/policies

# Get claims
curl http://localhost:3001/api/v1/claims
```

### View Database
```bash
cd ibms-backend
npx prisma studio
```
Opens Prisma Studio at http://localhost:5555

---

## 🐛 Troubleshooting

### Issue: "Loading..." never completes

**Solution:**
1. Check backend is running: `curl http://localhost:3001/api/v1/health`
2. Check browser console for errors (F12)
3. Verify DATABASE_URL in `ibms-backend/.env`

### Issue: "No data" or empty lists

**Solution:**
1. Check if database is seeded:
   ```bash
   cd ibms-backend
   npx prisma db seed
   ```
2. Verify data in Prisma Studio
3. Check API response in Network tab (F12)

### Issue: Login fails

**Solution:**
1. Verify credentials: `admin@sic.com` / `Admin@123`
2. Check backend logs for errors
3. Verify JWT keys exist in `ibms-backend/keys/`

### Issue: CORS errors

**Solution:**
1. Check `CORS_ORIGINS` in `ibms-backend/.env`
2. Should include: `http://localhost:3000`
3. Restart backend after changes

---

## 📊 Expected Data

After seeding, you should have:

- **2 Tenants**: SIC Insurance, Enterprise Insurance
- **2 Admin Users**: admin@sic.com, admin@enterprise.com
- **6 Branches**: 3 per tenant
- **10 Carriers**: 5 per tenant
- **30 Products**: 3 per carrier

---

## ✅ Success Indicators

### Frontend
- ✅ No console errors
- ✅ All pages load without "Loading..." stuck
- ✅ Data displays in tables
- ✅ Filters work
- ✅ Search works
- ✅ Navigation works
- ✅ Forms submit successfully

### Backend
- ✅ Server starts without errors
- ✅ All routes respond
- ✅ Database connection successful
- ✅ Swagger docs accessible at http://localhost:3001/api/docs

### Database
- ✅ Tables populated with seed data
- ✅ Queries execute successfully
- ✅ Relationships intact
- ✅ Constraints enforced

---

## 🎯 Performance Checks

### Page Load Times
- Dashboard: < 2 seconds
- Client List: < 1 second
- Policy List: < 1 second
- Claim List: < 1 second

### API Response Times
- GET requests: < 500ms
- POST requests: < 1s
- Complex queries: < 2s

---

## 📝 Test Scenarios

### Scenario 1: Create New Client
1. Go to Clients page
2. Click "New Client"
3. Fill in form
4. Submit
5. Verify client appears in list
6. Check database in Prisma Studio

### Scenario 2: Update Policy
1. Go to Policies page
2. Click on a policy
3. Click "Edit"
4. Change status
5. Save
6. Verify change persists

### Scenario 3: File Claim
1. Go to Claims page
2. Click "Report New Claim"
3. Fill in FNOL form
4. Submit
5. Verify claim appears in list

### Scenario 4: Lead Conversion
1. Go to Leads page
2. Drag lead to "Converted" column
3. Verify status updates
4. Check if client created

---

## 🎉 Migration Verification

Run this command to verify migration:
```bash
node find-mock-usage.js
```

**Expected Output:**
```
✅ Total files to migrate: 1
```

Only `mock/clients.ts` should remain (internal helper functions).

---

## 📚 API Documentation

Visit Swagger docs for complete API reference:
```
http://localhost:3001/api/docs
```

---

## 🔐 Test Users

### SIC Insurance
- Email: `admin@sic.com`
- Password: `Admin@123`
- Role: Tenant Admin

### Enterprise Insurance
- Email: `admin@enterprise.com`
- Password: `Admin@123`
- Role: Tenant Admin

---

## ✅ Final Checklist

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Login works
- [ ] Dashboard loads with real data
- [ ] All 5 core modules work (Clients, Policies, Claims, Leads, Finance)
- [ ] No console errors
- [ ] API calls succeed
- [ ] Database queries work
- [ ] CRUD operations functional
- [ ] Real-time features work (if applicable)

---

## 🎊 Success!

If all tests pass, your IBMS is now a **fully functional full-stack application**!

**What's Working:**
- ✅ 52 pages connected to real API
- ✅ 150+ API endpoints operational
- ✅ PostgreSQL database integrated
- ✅ Multi-tenancy working
- ✅ Authentication & authorization
- ✅ Real-time WebSocket features
- ✅ Complete CRUD operations
- ✅ Professional UI/UX

**Congratulations! 🎉**
