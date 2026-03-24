const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, 'src', 'app');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

// Escaping and matching the exact structure from clients/page.tsx
const regex1 = /if\s*\(\s*isLoading\s*\)\s*\{\s*return\s*\(\s*<div className="flex items-center justify-center h-96">\s*<div className="text-center">\s*<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-[0-9]+ mx-auto"><\/div>\s*<p className="mt-4 text-sm text-surface-500">Loading ([\w\s]+)\.\.\.<\/p>\s*<\/div>\s*<\/div>\s*\);\s*\}/g;

// Also a fallback for h-8 w-8 or h-screen loaders if there are any
const regex2 = /if\s*\(\s*isLoading\s*\)\s*\{\s*return\s*\(\s*<div className="flex[\s\w-]*justify-center[ \w-]*">\s*<div className="animate-spin rounded-full h-[0-9]+ w-[0-9]+ border-b-2 border-primary-[0-9]+" \/>\s*<\/div>\s*\);\s*\}/g;

walkDir(srcAppDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        let match;
        // Test regex1
        while ((match = regex1.exec(content)) !== null) {
            const messageStr = match[1].trim(); 
            const replaceStr = `if (isLoading) {\n        return <AppLoader message="Loading ${messageStr}..." isLoading={true} />;\n    }`;
            content = content.replace(match[0], replaceStr);
            modified = true;
            regex1.lastIndex = 0;
        }

        // Test regex2
        while ((match = regex2.exec(content)) !== null) {
            const replaceStr = `if (isLoading) {\n        return <AppLoader message="Loading details..." isLoading={true} />;\n    }`;
            content = content.replace(match[0], replaceStr);
            modified = true;
            regex2.lastIndex = 0;
        }

        // Add import
        if (modified) {
            if (!content.includes('AppLoader')) {
                const importMatch = [...content.matchAll(/^import.*from.*;$/gm)];
                if (importMatch.length > 0) {
                    const lastImport = importMatch[importMatch.length - 1];
                    const insertPos = lastImport.index + lastImport[0].length;
                    content = content.slice(0, insertPos) + '\nimport { AppLoader } from \'@/components/ui/AppLoader\';' + content.slice(insertPos);
                } else {
                    content = 'import { AppLoader } from \'@/components/ui/AppLoader\';\n' + content;
                }
            }
            fs.writeFileSync(filePath, content);
            console.log(`Successfully Updated loaders in ${filePath}`);
        }
    }
});
