const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all carriers...');
    
    // Get all carriers
    const carriers = await prisma.carrier.findMany({
        include: {
            _count: {
                select: { products: true, policies: true }
            }
        }
    });

    console.log(`Found ${carriers.length} total carriers in DB.`);

    // Group by slug
    const groups = new Map();
    for (const c of carriers) {
        const key = `${c.slug}`;
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
            
            if (dup._count.policies > 0) {
                console.log(`    Re-mapping ${dup._count.policies} policies to canonical...`);
                await prisma.policy.updateMany({
                    where: { carrierId: dup.id },
                    data: { carrierId: canonical.id }
                });
            }

            if (dup._count.products > 0) {
                const dupProducts = await prisma.product.findMany({ where: { carrierId: dup.id } });
                const canonProducts = await prisma.product.findMany({ where: { carrierId: canonical.id } });

                for (const dProd of dupProducts) {
                    const cProd = canonProducts.find(p => p.code === dProd.code);
                    if (cProd) {
                        // Remap underlying policies
                        await prisma.policy.updateMany({
                            where: { productId: dProd.id },
                            data: { productId: cProd.id }
                        });
                        // Safe to delete duplicate product
                        await prisma.product.delete({ where: { id: dProd.id } });
                    } else {
                        // Move safely
                        await prisma.product.update({
                            where: { id: dProd.id },
                            data: { carrierId: canonical.id }
                        });
                    }
                }
            }

            console.log(`    Deleting duplicate ${dup.id}...`);
            await prisma.carrier.delete({ where: { id: dup.id } });
            deleted++;
        }
    }

    // Now set all surviving to global
    console.log(`\nSetting all remaining carriers to global...`);
    await prisma.carrier.updateMany({ data: { tenantId: null } });
    await prisma.product.updateMany({ data: { tenantId: null } });

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
