import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('ibms-backend/src');

function getRelativePathToRoleUtils(filePath: string) {
  const fileDir = path.dirname(filePath);
  const targetDir = path.resolve(SRC_DIR, 'common/constants');
  let relPath = path.relative(fileDir, targetDir).replace(/\\/g, '/');
  if (!relPath.startsWith('.')) {
    relPath = './' + relPath;
  }
  return `${relPath}/role-utils.js`;
}

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // 1. Remove getActorMaxRoleLevel definition
  // It usually looks like:
  //   private async getActorMaxRoleLevel(
  //     ...
  //   }
  const getActorRegex = /\s*private\s+async\s+getActorMaxRoleLevel\s*\(\s*tenantId[^]*?\s*userId[^]*?\s*\)\s*:\s*Promise<number>\s*\{[^]*?return[^]*?\}[ \t]*\n?/g;
  if (getActorRegex.test(content)) {
      content = content.replace(getActorRegex, '');
      changed = true;
  }
  
  // Also try to catch without typing:
  const getActorRegex2 = /\s*private\s+async\s+getActorMaxRoleLevel\(.*?\)\s*\{[\s\S]*?(?:return.*?Math\.max\([\s\S]*?\);|return\s+0;)\s*\}/g;
  if (getActorRegex2.test(content)) {
      content = content.replace(getActorRegex2, '');
      changed = true;
  }

  // 2. Replace calls to getActorMaxRoleLevel
  const callRegex1 = /this\.getActorMaxRoleLevel\([^,]+,\s*userId\)/g;
  if (callRegex1.test(content)) {
      content = content.replace(callRegex1, 'getUserRoleLevel(this.prisma, userId)');
      changed = true;
  }

  const callRegex2 = /this\.getActorMaxRoleLevel\([^,]+,\s*([^)]+)\)/g;
  if (callRegex2.test(content)) {
      content = content.replace(callRegex2, 'getUserRoleLevel(this.prisma, $1)');
      changed = true;
  }

  // 3. Add import to getUserRoleLevel if needed and not present
  if (changed && !content.includes('getUserRoleLevel')) {
      const relPath = getRelativePathToRoleUtils(filePath);
      const importStmt = `import { getUserRoleLevel } from '${relPath}';\n`;
      // Insert after the last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
          const endOfLine = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLine + 1) + importStmt + content.slice(endOfLine + 1);
      } else {
          content = importStmt + content;
      }
  }

  // 4. Remove normalizeRoleName from imports
  // Could be import { ..., normalizeRoleName, ... } from '...';
  const normRegex = /,\s*normalizeRoleName/g;
  if (normRegex.test(content)) {
      content = content.replace(normRegex, '');
      changed = true;
  }
  const normRegex2 = /normalizeRoleName\s*,\s*/g;
  if (normRegex2.test(content)) {
      content = content.replace(normRegex2, '');
      changed = true;
  }
  const normRegex3 = /\bnormalizeRoleName\b\s*,?/g;
  // Let's only remove from import statements to be safe, or just do a global replace
  
  // 5. Some files use just UserRoleMapping in Prisma types, ignore those unless it's a specific pattern.
  // E.g., userRoleMappings in findMany
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(SRC_DIR);
console.log('Codemod complete.');
