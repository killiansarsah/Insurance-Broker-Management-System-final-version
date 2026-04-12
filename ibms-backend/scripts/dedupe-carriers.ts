import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all carriers...');
    
    // Get all carriers with counts
    const carriers = await prisma.carrier.findMany({
        include: {
            _count: {
                select: { products: true, policies: true }
            }
        }
    });

    console.log(`Found ${carriers.length} total carriers in DB.`);

    // Group by slug + tenantId (to see duplicates within a tenant)
    const groups = new Map();
    for (const c of carriers) {
        const key = `${c.slug}_${c.tenantId}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(c);
    }

    console.log(`Unique carrier groupings: ${groups.size}`);

    let deleted = 0;
    let retained = 0;

    for (const [key, group] of groups.entries()) {
        if (group.length === 1) {
            retained++;
            continue;
        }

        console.log(`\nGroup ${key} has ${group.length} duplicates.`);
        
        // Find the canonical one - prefer the one WITH products
        group.sort((a, b) => b._count.products - a._count.products);
        const canonical = group[0];
        const duplicates = group.slice(1);
        
        console.log(`  Canonical: ${canonical.id} (Products: ${canonical._count.products})`);
        retained++;

        // Delete duplicates safely
        for (const dup of duplicates) {
            console.log(`  Duplicate: ${dup.id} (Products: ${dup._count.products}, Policies: ${dup._count.policies})`);
            
            // Re-map any policies if necessary (it should be 0 based on early seed, but just in case)
            if (dup._count.policies > 0) {
                console.log(`    Re-mapping ${dup._count.policies} policies to canonical...`);
                await prisma.policy.updateMany({
                    where: { carrierId: dup.id },
                    data: { carrierId: canonical.id }
                });
            }

            // Re-map products
            if (dup._count.products > 0) {
                 await prisma.product.updateMany({
                    where: { carrierId: dup.id },
                    data: { carrierId: canonical.id }
                });
            }

            console.log(`    Deleting duplicate ${dup.id}...`);
            await prisma.carrier.delete({ where: { id: dup.id } });
            deleted++;
        }
    }

    console.log(`\nCleanup complete. Retained: ${retained}, Deleted: ${deleted}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
