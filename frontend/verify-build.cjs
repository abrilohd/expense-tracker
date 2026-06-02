/**
 * Build Verification Script
 * Checks if production build is ready for deployment
 */
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Production Build...\n');

const checks = [
  {
    name: 'dist folder exists',
    check: () => fs.existsSync(path.join(__dirname, 'dist')),
  },
  {
    name: 'index.html exists',
    check: () => fs.existsSync(path.join(__dirname, 'dist', 'index.html')),
  },
  {
    name: 'CSS bundle exists',
    check: () => {
      const assetsDir = path.join(__dirname, 'dist', 'assets');
      if (!fs.existsSync(assetsDir)) return false;
      const files = fs.readdirSync(assetsDir);
      return files.some(f => f.endsWith('.css'));
    },
  },
  {
    name: 'JS bundles exist',
    check: () => {
      const assetsDir = path.join(__dirname, 'dist', 'assets');
      if (!fs.existsSync(assetsDir)) return false;
      const files = fs.readdirSync(assetsDir);
      return files.some(f => f.endsWith('.js'));
    },
  },
  {
    name: 'No hardcoded localhost in build',
    check: () => {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      if (!fs.existsSync(indexPath)) return false;
      const content = fs.readFileSync(indexPath, 'utf-8');
      return !content.includes('localhost:5500');
    },
  },
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check }) => {
  try {
    const result = check();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n  Build is ready for deployment!');
  process.exit(0);
} else {
  console.log('\n⚠️  Build has issues. Please fix before deploying.');
  process.exit(1);
}
