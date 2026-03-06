const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app', 'dashboard');

// Hook mappings for different pages
const hookMappings = {
  'clients': { hook: 'useClients', dataKey: 'clients' },
  'policies': { hook: 'usePolicies', dataKey: 'policies' },
  'claims': { hook: 'useClaims', dataKey: 'claims' },
  'leads': { hook: 'useLeads', dataKey: 'leads' },
  'carriers': { hook: 'useCarriers', dataKey: 'carriers' },
  'finance/invoices': { hook: 'useInvoices', dataKey: 'invoices' },
  'finance/commissions': { hook: 'useCommissions', dataKey: 'commissions' },
  'finance/expenses': { hook: 'useExpenses', dataKey: 'expenses' },
  'renewals': { hook: 'useRenewals', dataKey: 'renewals' },
  'complaints': { hook: 'useComplaints', dataKey: 'complaints' },
  'documents': { hook: 'useDocuments', dataKey: 'documents' },
  'admin/users': { hook: 'useUsers', dataKey: 'users' },
  'departments': { hook: 'useDepartments', dataKey: 'departments' },
  'approvals': { hook: 'useApprovals', dataKey: 'approvals' },
};

function addLoadingState(content) {
  // Check if loading state already exists
  if (content.includes('if (isLoading)')) {
    return content;
  }

  // Find the return statement
  const returnMatch = content.match(/return\s*\(/);
  if (!returnMatch) return content;

  const loadingState = `
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-surface-500">Loading...</p>
                </div>
            </div>
        );
    }

    `;

  // Insert before return
  const insertPos = returnMatch.index;
  return content.slice(0, insertPos) + loadingState + content.slice(insertPos);
}

function processFile(filePath, relativePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Skip if it's not a page component
  if (!content.includes('export default function')) {
    return false;
  }

  // Find which module this belongs to
  let hookInfo = null;
  for (const [module, info] of Object.entries(hookMappings)) {
    if (relativePath.includes(module)) {
      hookInfo = info;
      break;
    }
  }

  if (!hookInfo) return false;

  // Check if hook is already added
  if (content.includes(`const { data:`) && content.includes('isLoading')) {
    return false;
  }

  // Add loading state
  content = addLoadingState(content);
  modified = true;

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function processDirectory(dir, baseDir = dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && !file.startsWith('[')) {
      count += processDirectory(filePath, baseDir);
    } else if (file === 'page.tsx') {
      const relativePath = path.relative(baseDir, filePath);
      if (processFile(filePath, relativePath)) {
        console.log(`✅ Added loading state: ${relativePath}`);
        count++;
      }
    }
  });

  return count;
}

console.log('🔧 Adding loading states to pages...\n');
const count = processDirectory(pagesDir);
console.log(`\n✅ Complete! Added loading states to ${count} files.`);
