import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const generateFakerUser = async () => {
    await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            image: faker.image.avatar(),
            gender: faker.person.sex(),
            postalCode: faker.location.zipCode(),
            phoneNumber: faker.phone.number(),
            role: "USER",
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            emailVerified: new Date(),
        }
    })
};

const generateAdmin = async () => {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            name: "okazereunion",
            username: "",
            email: "okaze.reunion@gmail.com",
            password: hashedPassword,
            image: faker.image.avatar(),
            role: "ADMIN",
            createdAt: new Date(),
            updatedAt: new Date(),
            emailVerified: new Date(),
        }
    })
};

const clearDatabase = async () => {
    await prisma.account.deleteMany({});
    await prisma.attribut.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.contentMessage.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.lot.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
};

async function main() {
    if (process.env.NODE_ENV !== "development") {
        return
    }

    await clearDatabase();

    await generateAdmin();
    await generateFakerUser();

    console.log("seeding ok !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });