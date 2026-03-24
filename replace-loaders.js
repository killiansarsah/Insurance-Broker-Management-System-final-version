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

const toTitleCase = (str) => {
    return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

walkDir(srcAppDir, (filePath) => {
    if (filePath.endsWith('loading.tsx')) {
        const parts = filePath.split(path.sep);
        let section = 'application';
        let isDetail = false;
        
        // Find the folder name closest to 'loading.tsx' that is not '[id]' or similar
        for (let i = parts.length - 2; i >= 0; i--) {
            if (parts[i].startsWith('[')) {
                isDetail = true;
                continue;
            }
            if (parts[i] && parts[i] !== 'dashboard' && parts[i] !== 'app' && parts[i] !== '(super-admin)' && parts[i] !== 'super-admin') {
                section = parts[i];
                break;
            }
        }
        
        let message = `Loading ${section.replace(/-/g, ' ')}...`;
        if (isDetail) {
            // Remove 's' at the end for singular form, cheap plural trick
            const singular = section.endsWith('s') ? section.slice(0, -1) : section;
            message = `Loading ${singular.replace(/-/g, ' ')} details...`;
        }
        
        const fileContent = `import { AppLoader } from '@/components/ui/AppLoader';

export default function Loading() {
    return <AppLoader message="${message}" isLoading={true} />;
}
`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`Updated ${filePath} with message: ${message}`);
    }
});
