const { PrismaClient } = require("@prisma/client");

async function main() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgres://186f6748e81e6e1aff128a21557cd0c1ce591c3b31fa3a03accccb540fce1832:sk_JWdltpNCpJp_5EylHNABc@db.prisma.io:5432/postgres?sslmode=require"
            }
        }
    });

    try {
        console.log("Attempting to create a test story...");
        const story = await prisma.communityStory.create({
            data: {
                content: "Test story from CLI to debug 500 error",
                source: "cli-test",
                isVerified: false
            }
        });
        console.log("Success! Created story with ID:", story.id);
    } catch (err) {
        console.error("Creation failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
