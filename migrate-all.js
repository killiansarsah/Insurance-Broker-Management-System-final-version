const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Mapping of mock imports to API hooks
const migrations = {
  "from '@/mock/clients'": "from '@/hooks/api'",
  "from '@/mock/policies'": "from '@/hooks/api'",
  "from '@/mock/claims'": "from '@/hooks/api'",
  "from '@/mock/leads'": "from '@/hooks/api'",
  "from '@/mock/carriers'": "from '@/hooks/api'",
  "from '@/mock/carrier-products'": "from '@/hooks/api'",
  "from '@/mock/finance'": "from '@/hooks/api'",
  "from '@/mock/commissions'": "from '@/hooks/api'",
  "from '@/mock/expenses'": "from '@/hooks/api'",
  "from '@/mock/payments'": "from '@/hooks/api'",
  "from '@/mock/premium-financing'": "from '@/hooks/api'",
  "from '@/mock/renewals'": "from '@/hooks/api'",
  "from '@/mock/quotes'": "from '@/hooks/api'",
  "from '@/mock/documents-complaints'": "from '@/hooks/api'",
  "from '@/mock/chat'": "from '@/hooks/api'",
  "from '@/mock/calendar-events'": "from '@/hooks/api'",
  "from '@/mock/users'": "from '@/hooks/api'",
  "from '@/mock/reports'": "from '@/hooks/api'",
  "from '@/mock/finance-reports'": "from '@/hooks/api'",
  "from '@/mock/notifications'": "from '@/hooks/api'",
};

// Variable name mappings
const varMappings = {
  'mockClients': 'clients',
  'mockPolicies': 'policies',
  'mockLeads': 'leads',
  'claims': 'claims',
  'invoices': 'invoices',
  'carriers': 'carriers',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Skip if already migrated or is a mock file itself
  if (filePath.includes('\\mock\\') || filePath.includes('/mock/')) {
    return false;
  }

  // Check if file has mock imports
  const hasMockImport = Object.keys(migrations).some(mock => content.includes(mock));
  if (!hasMockImport) {
    return false;
  }

  // Replace mock imports with API hooks
  Object.entries(migrations).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
      modified = true;
    }
  });

  // Remove "Mock data as fallback" comments
  content = content.replace(/\/\/ Mock data as fallback[^\n]*\n/g, '');
  content = content.replace(/\/\/ Mock data[^\n]*\n/g, '');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function migrateDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      count += migrateDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (migrateFile(filePath)) {
        const relativePath = path.relative(srcDir, filePath);
        console.log(`✅ Migrated: ${relativePath}`);
        count++;
      }
    }
  });

  return count;
}

console.log('🚀 Starting automated migration...\n');
const migratedCount = migrateDirectory(srcDir);
console.log(`\n✅ Migration complete! Updated ${migratedCount} files.`);
console.log('\n⚠️  Note: Some files may need manual adjustment for:');
console.log('   - Adding useQuery/useMutation hooks');
console.log('   - Adding loading states');
console.log('   - Handling data?.data structure');
console.log('\n📝 Run: node find-mock-usage.js to check remaining files');
