#!/usr/bin/env node

/**
 * Search Functionality Test Script
 * Run this after implementing the search feature to verify it works
 */

const API_BASE = 'http://localhost:3001/api/v1';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSearchEndpoint(token) {
  log('\n📝 Testing Search Endpoint...', 'blue');
  
  try {
    const response = await fetch(`${API_BASE}/search?q=test`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      log('❌ Authentication failed. Please check your token.', 'red');
      return false;
    }

    if (!response.ok) {
      log(`❌ Search endpoint returned ${response.status}`, 'red');
      return false;
    }

    const data = await response.json();
    log(`✅ Search endpoint working! Found ${data.length} results`, 'green');
    
    if (data.length > 0) {
      log(`   Sample result: ${data[0].title} (${data[0].type})`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testRecentEndpoint(token) {
  log('\n🕐 Testing Recent Items Endpoint...', 'blue');
  
  try {
    const response = await fetch(`${API_BASE}/search/recent`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      log(`❌ Recent endpoint returned ${response.status}`, 'red');
      return false;
    }

    const data = await response.json();
    log(`✅ Recent endpoint working! Found ${data.length} items`, 'green');
    
    if (data.length > 0) {
      log(`   Sample item: ${data[0].title} (${data[0].type})`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testDatabaseData(token) {
  log('\n🗄️  Checking Database Data...', 'blue');
  
  const entities = ['clients', 'policies', 'claims', 'leads'];
  let hasData = false;
  
  for (const entity of entities) {
    try {
      const response = await fetch(`${API_BASE}/${entity}?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const count = Array.isArray(data) ? data.length : (data.items?.length || 0);
        
        if (count > 0) {
          log(`   ✅ ${entity}: Has data`, 'green');
          hasData = true;
        } else {
          log(`   ⚠️  ${entity}: No data found`, 'yellow');
        }
      }
    } catch (error) {
      log(`   ❌ ${entity}: Error checking`, 'red');
    }
  }
  
  if (!hasData) {
    log('\n⚠️  Warning: No data found in database. Search will return empty results.', 'yellow');
    log('   Run: npm run prisma:seed (in backend directory)', 'yellow');
  }
  
  return hasData;
}

async function main() {
  log('╔════════════════════════════════════════╗', 'blue');
  log('║   IBMS Search Functionality Test      ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  
  // Check if backend is running
  log('\n🔍 Checking backend server...', 'blue');
  try {
    const response = await fetch(`${API_BASE.replace('/api/v1', '')}/api/v1/health`);
    if (response.ok) {
      log('✅ Backend server is running', 'green');
    } else {
      log('❌ Backend server returned error', 'red');
      process.exit(1);
    }
  } catch (error) {
    log('❌ Backend server is not running!', 'red');
    log('   Start it with: npm run start:dev', 'yellow');
    process.exit(1);
  }

  // Get token from command line or prompt
  const token = process.argv[2];
  
  if (!token) {
    log('\n❌ No authentication token provided!', 'red');
    log('\nUsage:', 'yellow');
    log('  node test-search.js YOUR_JWT_TOKEN', 'yellow');
    log('\nTo get a token:', 'yellow');
    log('  1. Login to the app', 'yellow');
    log('  2. Open browser console', 'yellow');
    log('  3. Run: apiClient.getAccessToken()', 'yellow');
    log('  4. Copy the token and run this script', 'yellow');
    process.exit(1);
  }

  // Run tests
  const searchOk = await testSearchEndpoint(token);
  const recentOk = await testRecentEndpoint(token);
  const hasData = await testDatabaseData(token);

  // Summary
  log('\n' + '═'.repeat(40), 'blue');
  log('Test Summary:', 'blue');
  log('═'.repeat(40), 'blue');
  log(`Search Endpoint:  ${searchOk ? '✅ PASS' : '❌ FAIL'}`, searchOk ? 'green' : 'red');
  log(`Recent Endpoint:  ${recentOk ? '✅ PASS' : '❌ FAIL'}`, recentOk ? 'green' : 'red');
  log(`Database Data:    ${hasData ? '✅ HAS DATA' : '⚠️  NO DATA'}`, hasData ? 'green' : 'yellow');
  
  if (searchOk && recentOk) {
    log('\n🎉 All tests passed! Search functionality is working.', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Please check the errors above.', 'red');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
