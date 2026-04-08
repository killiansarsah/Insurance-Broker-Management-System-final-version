const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.$executeRawUnsafe(
  "UPDATE users SET role = 'AGENT' WHERE email = 'superadmin@brokerium.com'"
)
  .then(function(count) {
    console.log('Demoted superadmin@brokerium.com to AGENT: ' + count + ' row(s)');
    return p.$queryRawUnsafe('SELECT email, role::text as role FROM users ORDER BY role, email');
  })
  .then(function(r) {
    console.table(r);
    return p.$disconnect();
  })
  .catch(function(e) {
    console.error(e);
    return p.$disconnect();
  });
