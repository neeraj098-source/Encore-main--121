
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Database Seeding...");

    const testEmails = [
        'freshman@test.com', 'regular@test.com', 'traveler@test.com',
        'leader@test.com', 'member1@test.com', 'member2@test.com',
        'ca@test.com', 'pending@test.com', 'rich@test.com',
        'ref1@test.com', 'ref2@test.com', 'ref3@test.com', 'ref4@test.com', 'ref5@test.com'
    ];

    console.log("🧹 Cleaning up existing test data...");

    // 1. Delete Orders from these users
    await prisma.order.deleteMany({
        where: { user: { email: { in: testEmails } } }
    });

    // 2. Delete CoinHistory
    await prisma.coinHistory.deleteMany({
        where: { user: { email: { in: testEmails } } }
    });

    // 3. Delete Teams (where leader is one of them)
    // Note: Members will be disconnected automatically or we delete them next
    await prisma.team.deleteMany({
        where: { leader: { email: { in: testEmails } } }
    });

    // 4. Finally delete the users
    // Note: Due to self-relations (referredBy, team members), sometimes order matters or we need multiple passes.
    // Ideally delete referrals first? 
    // Prisma deleteMany might handle simple checks but foreign keys are strict.
    // Let's rely on deleteMany. If User A refers User B, and we delete both, it usually works if ON DELETE SET NULL/CASCADE is set, or if we delete B then A.
    // We will try deleting all in one go.
    await prisma.user.deleteMany({
        where: { email: { in: testEmails } }
    });

    console.log("✅ Cleanup complete.");

    // --- SCENARIO 1: The Freshman ---
    console.log("Creating Freshman...");
    await prisma.user.create({
        data: {
            name: "Franny Freshman",
            email: "freshman@test.com",
            phone: "9000000001",
            college: "IET Lucknow",
            year: "1",
            accommodation: "no",
            profileCompleted: false,
            password: "password123"
        }
    });

    // --- SCENARIO 2: The Regular ---
    console.log("Creating Regular...");
    await prisma.user.create({
        data: {
            name: "Reggie Regular",
            email: "regular@test.com",
            phone: "9000000002",
            college: "IET Lucknow",
            year: "2",
            accommodation: "no",
            profileCompleted: true,
            totalPaid: 399,
            paymentVerified: true,
            paymentId: "PAY_REG_123",
            password: "password123"
        }
    });

    // --- SCENARIO 3: The Traveler ---
    console.log("Creating Traveler...");
    await prisma.user.create({
        data: {
            name: "Travis Traveler",
            email: "traveler@test.com",
            phone: "9000000003",
            college: "IIT Kanpur",
            year: "3",
            accommodation: "yes",
            profileCompleted: true,
            totalPaid: 999,
            paymentVerified: true,
            paymentId: "PAY_TRAV_999",
            password: "password123"
        }
    });

    // --- SCENARIO 4: The Pending ---
    console.log("Creating Pending User...");
    await prisma.user.create({
        data: {
            name: "Penny Pending",
            email: "pending@test.com",
            phone: "9000000004",
            college: "BBD University",
            year: "2",
            accommodation: "no",
            profileCompleted: true,
            totalPaid: 399,
            paymentVerified: false,
            paymentScreenshot: "https://placehold.co/600x400/orange/white?text=Payment+Proof",
            orders: {
                create: [
                    {
                        totalAmount: 150,
                        status: "PENDING",
                        items: {
                            create: [{ eventSlug: "dance-battle", eventName: "One to One Battle", price: 150 }]
                        }
                    }
                ]
            }
        }
    });

    // --- SCENARIO 5: The CA ---
    console.log("Creating CA...");
    await prisma.user.create({
        data: {
            name: "Charlie CA",
            email: "ca@test.com",
            phone: "9000000005",
            college: "Lucknow University",
            year: "3",
            role: "CA",
            referralCode: "CA8888",
            caCoins: 500,
            coinHistory: {
                create: [
                    { amount: 50, reason: "Referral Bonus: User A" },
                    { amount: 50, reason: "Referral Bonus: User B" },
                    { amount: 100, reason: "Instagram Task" }
                ]
            }
        }
    });

    // Create Referrals for CA
    for (let i = 1; i <= 5; i++) {
        await prisma.user.create({
            data: {
                name: `Referred User ${i}`,
                email: `ref${i}@test.com`,
                referredBy: "CA8888" // Links to CA user created above
            }
        });
    }
    console.log("✅ Created: CA + 5 Referrals");


    // --- SCENARIO 6: Team ---
    console.log("Creating Team...");
    const leader = await prisma.user.create({
        data: {
            name: "Liam Leader",
            email: "leader@test.com",
            phone: "9000000006",
            college: "IET Lucknow",
            year: "4",
            paymentVerified: true,
            totalPaid: 399
        }
    });

    const team = await prisma.team.create({
        data: {
            name: "Pixel Pirates",
            code: "12345",
            eventSlug: "treasure-hunt",
            leaderId: leader.id,
            members: {
                connect: { id: leader.id }
            }
        }
    });

    // Members
    await prisma.user.create({
        data: {
            name: "Mike Member",
            email: "member1@test.com",
            phone: "9000000007",
            college: "IET Lucknow",
            paymentVerified: true,
            teams: { connect: { id: team.id } }
        }
    });

    await prisma.user.create({
        data: {
            name: "Molly Member",
            email: "member2@test.com",
            phone: "9000000008",
            college: "IET Lucknow",
            paymentVerified: true,
            teams: { connect: { id: team.id } }
        }
    });
    console.log("✅ Created: Team Scenario");


    // --- SCENARIO 7: Rich Kid ---
    console.log("Creating Rich Kid...");
    await prisma.user.create({
        data: {
            name: "Richie Rich",
            email: "rich@test.com",
            phone: "9000000009",
            college: "Amity",
            paymentVerified: true,
            totalPaid: 999,
            accommodation: "yes",
            orders: {
                create: [
                    {
                        totalAmount: 600,
                        status: "PAID",
                        items: { create: [{ eventSlug: "band-war", eventName: "Swarsangam", price: 600 }] }
                    },
                    {
                        totalAmount: 300,
                        status: "PENDING",
                        items: { create: [{ eventSlug: "pageant", eventName: "Mr/Miss Encore", price: 300 }] }
                    }
                ]
            }
        }
    });
    console.log("✅ Created: Rich User");

    console.log("\n✨ Seeding Complete!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
