
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const colleges = [
    'IET Lucknow',
    'BBD University',
    'Amity University',
    'Integral University',
    'SRMU',
    'Lucknow University',
    'IIIT Lucknow',
    'IIT Kanpur'
];

const eventSlugs = [
    "cosplay", "battle-of-bands", "group-dance", "solo-singing", "fashion-show",
    "nukkad-natak", "robotics", "coding-contest", "bgmi", "valorant",
    "debate", "quiz", "photography", "short-film"
];

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayan", "Krishna", "Ishaan", "Shaurya", "Atharv", "Advik", "Pranav", "Advaith", "Aaryan", "Dhruv", "Kabir", "Rudra", "Riyan", "Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Siya"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Yadav", "Mishra", "Tripathi", "Patel", "Reddy", "Nair", "Iyer", "Kumar", "Das", "Pal", "Chopra", "Malhotra", "Kapoor", "Jain", "Agarwal", "Saxena"];

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log('🌱 Starting seed...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create CAs (15 users)
    console.log('creating CAs...');
    const caCodes = [];
    for (let i = 0; i < 15; i++) {
        const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
        const email = `ca${i}@encore.com`;
        const code = `CA${2000 + i}`;
        caCodes.push(code);

        await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                name: `${name} (CA)`,
                email,
                password: hashedPassword,
                role: 'CA',
                referralCode: code,
                college: getRandomElement(colleges),
                phone: `98765${Math.floor(Math.random() * 90000) + 10000}`,
                caCoins: Math.floor(Math.random() * 5000),
                profileCompleted: true,
                paymentVerified: Math.random() > 0.5,
                totalPaid: Math.random() > 0.5 ? 399 : 0
            }
        });
    }

    // 2. Create Diverse Users (85 users)
    console.log('creating Users...');
    for (let i = 0; i < 85; i++) {
        const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
        const email = `user${i}@test.com`;

        // Scenario Diversification
        const r = Math.random();
        let scenario = 'FRESH';
        if (r > 0.8) scenario = 'PREMIUM_PAID'; // 20%
        else if (r > 0.6) scenario = 'BASIC_PAID'; // 20%
        else if (r > 0.4) scenario = 'CART_ABANDONED'; // 20%
        else if (r > 0.2) scenario = 'REGISTERED_ONLY'; // 20%

        const college = getRandomElement(colleges);
        const accommodation = scenario === 'PREMIUM_PAID' ? 'yes' : 'no';
        const totalPaid = scenario === 'PREMIUM_PAID' ? 999 : (scenario === 'BASIC_PAID' ? 399 : 0);
        const isPaid = totalPaid > 0;

        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                name,
                email,
                password: hashedPassword,
                college,
                year: '2nd Year',
                phone: `91234${Math.floor(Math.random() * 90000) + 10000}`,
                accommodation,
                totalPaid,
                paymentVerified: isPaid ? (Math.random() > 0.1) : false, // 90% verified if paid
                paymentId: isPaid ? `PAY_${Math.random().toString(36).substring(7).toUpperCase()}` : null,
                paymentScreenshot: isPaid ? 'https://placehold.co/400x800/png?text=Payment+Proof' : null,
                role: 'USER',
                referredBy: Math.random() > 0.6 ? getRandomElement(caCodes) : null,
                profileCompleted: true,

                // Random social tasks
                taskInsta: Math.random() > 0.5,
                taskX: Math.random() > 0.5,
                taskLinkedIn: Math.random() > 0.5,
                taskFacebook: Math.random() > 0.5,

                // Cart tasks
                taskCart: Math.random() > 0.3,
                taskCart5: Math.random() > 0.7,
            }
        });

        // Add Cart Items (For Cart Abandoned users mostly)
        if (scenario === 'CART_ABANDONED' || Math.random() > 0.7) {
            const numItems = Math.floor(Math.random() * 4) + 1;
            const items = new Set<string>();
            while (items.size < numItems) items.add(getRandomElement(eventSlugs));

            await prisma.cart.create({
                data: {
                    userId: user.id,
                    items: {
                        create: Array.from(items).map(slug => ({
                            eventSlug: slug,
                            eventName: slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                            price: Math.floor(Math.random() * 300) + 100
                        }))
                    }
                }
            });
        }

        // Add Orders (For Paid users)
        if (isPaid) {
            // Main Pass Order
            await prisma.order.create({
                data: {
                    userId: user.id,
                    totalAmount: totalPaid,
                    status: 'PAID',
                    passType: scenario === 'PREMIUM_PAID' ? 'premium' : 'basic',
                    paymentId: `ORD_${Math.random().toString(36).substring(7).toUpperCase()}`,
                    items: {
                        create: [{
                            eventSlug: 'fest-pass',
                            eventName: scenario === 'PREMIUM_PAID' ? 'Premium Pass' : 'Basic Pass',
                            price: totalPaid
                        }]
                    }
                }
            });

            // Random extra event order
            if (Math.random() > 0.6) {
                await prisma.order.create({
                    data: {
                        userId: user.id,
                        totalAmount: 250,
                        status: Math.random() > 0.2 ? 'PAID' : 'PENDING',
                        items: {
                            create: [{
                                eventSlug: getRandomElement(eventSlugs),
                                eventName: 'Random Event Entry',
                                price: 250
                            }]
                        }
                    }
                });
            }
        }
    }

    console.log('✅ Seed completed!');
    console.log('👉 Admin Access: Use secret from .env (ADMIN_SECRET)');
    console.log('👉 Sample CA: ca0@encore.com / password123');
    console.log('👉 Sample User: user0@test.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
