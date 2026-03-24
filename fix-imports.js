const fs = require('fs');

const filesToFix = [
    "src/app/dashboard/carriers/page.tsx",
    "src/app/dashboard/carriers/products/page.tsx",
    "src/app/dashboard/claims/page.tsx",
    "src/app/dashboard/clients/page.tsx",
    "src/app/dashboard/complaints/page.tsx",
    "src/app/dashboard/documents/page.tsx",
    "src/app/dashboard/leads/page.tsx",
    "src/app/dashboard/policies/page.tsx"
];

for (const f of filesToFix) {
    const fullPath = __dirname + '/' + f;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('import { AppLoader }')) {
        const importMatch = [...content.matchAll(/^import.*from.*;$/gm)];
        if (importMatch.length > 0) {
            const lastImport = importMatch[importMatch.length - 1];
            const insertPos = lastImport.index + lastImport[0].length;
            content = content.slice(0, insertPos) + "\nimport { AppLoader } from '@/components/ui/AppLoader';" + content.slice(insertPos);
        } else {
            content = "import { AppLoader } from '@/components/ui/AppLoader';\n" + content;
        }
        fs.writeFileSync(fullPath, content);
        console.log('Fixed imports in ' + f);
    }
}
