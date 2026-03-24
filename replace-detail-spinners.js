const fs = require('fs');
const path = require('path');

const files = [
    'src/app/dashboard/policies/[id]/edit/page.tsx',
    'src/app/dashboard/leads/[id]/client-page.tsx',
    'src/app/dashboard/complaints/[id]/client-page.tsx',
    'src/app/dashboard/clients/[id]/edit/edit-client-page.tsx',
    'src/app/dashboard/clients/[id]/client-page.tsx',
    'src/app/dashboard/claims/[id]/client-page.tsx',
    'src/app/dashboard/carriers/[id]/client-page.tsx'
];

for (const file of files) {
    const fullPath = path.join('c:/Users/killi/OneDrive/Desktop/IBMS Final Edition', file);
    if (!fs.existsSync(fullPath)) {
        console.log('Skipping missing file:', file);
        continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1. Add import if it doesn't exist
    if (!content.includes("import { AppLoader } from '@/components/ui/AppLoader';")) {
        // Find the Button or Card import and insert it after
        if (content.includes("import { Card } from '@/components/ui/card';")) {
            content = content.replace(
                "import { Card } from '@/components/ui/card';",
                "import { Card } from '@/components/ui/card';\nimport { AppLoader } from '@/components/ui/AppLoader';"
            );
        } else if (content.includes("import { Button } from '@/components/ui/button';")) {
            content = content.replace(
                "import { Button } from '@/components/ui/button';",
                "import { Button } from '@/components/ui/button';\nimport { AppLoader } from '@/components/ui/AppLoader';"
            );
        } else {
             // Just add it after the first import
             content = content.replace(/^import /m, "import { AppLoader } from '@/components/ui/AppLoader';\nimport ");
        }
    }

    // 2. Replace the spinner HTML blocks. 
    // They usually look like:
    // return (
    //     <div className="flex ... items-center justify-center ...">
    //         <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    //     </div>
    // );
    // Or for edit pages:
    //         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    //             <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    //             <p className="text-sm text-surface-500">Loading policy data...</p>
    //         </div>

    // Regex to match the entire return block containing the spinner
    const spinnerRegex = /return\s*\(\s*<div[^>]*className="[^"]*flex[^"]*items-center[^"]*justify-center[^"]*"[^>]*>\s*(?:<Loader2[^>]*>\s*|<div[^>]*animate-spin[^>]*>\s*<[/]div>\s*)?(?:<div[^>]*animate-spin[^>]*>\s*<[/]div>\s*)?(?:<p[^>]*>.*?<[/]p>\s*)?<[/]div>\s*\);/g;
    
    // We'll replace it with a simple AppLoader return
    const originalContent = content;
    
    // Find all matches to deduce specific messages or just use generic
    let match;
    while ((match = spinnerRegex.exec(content)) !== null) {
        let msg = "Loading details...";
        if (file.includes('policy')) msg = "Loading policy details...";
        if (file.includes('client')) msg = "Loading client profile...";
        if (file.includes('claim')) msg = "Loading claim details...";
        if (file.includes('carrier')) msg = "Loading carrier details...";
        if (file.includes('lead')) msg = "Loading lead details...";
        if (file.includes('complaint')) msg = "Loading complaint details...";
        
        content = content.replace(match[0], `return <AppLoader message="${msg}" isLoading={true} />;`);
    }

    // Also specifically handle `src/app/dashboard/policies/[id]/edit/page.tsx` since it uses Loader2
    if (file.includes('edit/page.tsx') && content.includes('Loading policy data...')) {
        const editRegex = /return\s*\(\s*<div[^>]*>\s*<Loader2[^>]*\/>\s*<p[^>]*>Loading policy data...<\/p>\s*<\/div>\s*\);/g;
        content = content.replace(editRegex, `return <AppLoader message="Loading policy details..." isLoading={true} />;`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed:', file);
    } else {
        console.log('No spinner blocks matched in:', file);
    }
}
