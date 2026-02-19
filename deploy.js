const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

// Ensure .nojekyll exists
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

// Get remote URL from parent repo
const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();

// Clean up any existing .git in out/
const outGit = path.join(outDir, '.git');
if (fs.existsSync(outGit)) {
    fs.rmSync(outGit, { recursive: true, force: true });
}

// Deploy via fresh git repo inside out/
console.log('Initializing deployment...');
execSync('git init', { cwd: outDir, stdio: 'inherit' });
execSync('git add -A', { cwd: outDir, stdio: 'inherit' });
execSync('git commit -m "Deploy to GitHub Pages"', { cwd: outDir, stdio: 'inherit' });
execSync(`git remote add origin ${remoteUrl}`, { cwd: outDir, stdio: 'inherit' });

console.log('Pushing to gh-pages...');
execSync('git push -f origin master:gh-pages', { cwd: outDir, stdio: 'inherit' });

// Clean up
fs.rmSync(outGit, { recursive: true, force: true });
console.log('\\n✅ Deployed successfully to gh-pages!');
