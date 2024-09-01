import { Post, PostState, PrismaClient } from "@prisma/client";
import { Faker, fr } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Créer une instance de Faker avec la locale française
const faker = new Faker({ locale: [fr] });

// Définir les dates de début et de fin
const startDate = new Date('2024-01-01T00:00:00Z'); // 1er janvier 2024
const endDate = new Date();

const generateFakerUser = async () => {
    await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            image: faker.image.url(),
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
    const hashedPassword = await bcrypt.hash("okaze.reunion@gmail.com", 10);
    await prisma.user.create({
        data: {
            name: "okazereunion",
            username: "",
            email: "okaze.reunion@gmail.com",
            password: hashedPassword,
            image: "/images/logo/okaze-logo.png",
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

const generateCategories = async () => {
    await prisma.category.createMany({
        data: [
            { name: "Mobilier", icon: "/data/icons/mobilier.png", altIcon: "Icone d'une chaise" },
            { name: "Décoration", icon: "/data/icons/decoration.png", altIcon: "Icone d'un tableaux'" },
            { name: "Mode", icon: "/data/icons/mode.png", altIcon: "Icone de Vetements" },
            { name: "Musique", icon: "/data/icons/musique.png", altIcon: "Icone d'une guitare" },
            { name: "Jouet", icon: "/data/icons/jouet.png", altIcon: "Icone d'un jouets" },
            { name: "Bébé", icon: "/data/icons/bebe.png", altIcon: "Icone de biberon" },
            { name: "Électronique", icon: "/data/icons/informatique.png", altIcon: "Icone d'un ordinateur" },
            { name: "Vintage", icon: "", altIcon: "Icone d'un rectangle bleu avec trois point au centre" },
            { name: "Maison", icon: "", altIcon: "Icone d'un rectangle bleu avec trois point au centre" },
            { name: "Jardin", icon: "", altIcon: "Icone d'un rectangle bleu avec trois point au centre" },
            { name: "Bricolage", icon: "", altIcon: "Icone d'un rectangle bleu avec trois point au centre" },
        ]
    })
};

const generatePost = async () => {

    const allCategories = await prisma.category.findMany();
    const randomIndex = Math.floor(Math.random() * allCategories.length);
    const randomCategory = allCategories[randomIndex];
    const states = ['new', 'very_good', 'good', 'satisfactory'];

    const uniqueIcode = await generateIcode();

    const title = faker.lorem.words(Math.floor(Math.random() * 3) + 2);
    const description = faker.lorem.sentences(Math.floor(Math.random() * 5) + 1);
    const minPrice = 5;
    const maxPrice = 300;
    const price = Math.random() * (maxPrice - minPrice) + minPrice;
    const roundedPrice = Math.round(price * 100) / 100;
    const state = states[Math.floor(Math.random() * states.length)];

    // Générer une date aléatoire entre les deux dates
    const randomCreatedAt = getRandomDate(startDate, endDate);

    const newPost = await prisma.post.create({
        data: {
            icode: uniqueIcode,
            title: title,
            price: roundedPrice,
            description: description,
            state: state as PostState,
            isActive: true,
            categories: {
                connect: {
                    id: randomCategory.id
                }
            },
            createdAt: randomCreatedAt,
            updatedAt: new Date(),
        }
    })

    // chiffre entre 1 et 4
    const randomNumberImage = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < randomNumberImage; i++) {
        await prisma.post.update({
            where: {
                id: newPost.id
            },
            data: {
                images: {
                    create: {
                        src: faker.image.urlLoremFlickr({ category: 'toy' }),
                        alt: faker.lorem.sentences(1),
                        extension: "jpg"
                    }
                }
            }
        })
    }


    // chiffre entre 1 et 2
    const randomNumberAttribut = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomNumberAttribut; i++) {
        const adjective = await getUniqueAttribute();
        await prisma.post.update({
            where: {
                id: newPost.id
            },
            data: {
                attributs: {
                    create: {
                        name: adjective,
                    }
                }
            }
        })
    }

};

const generateLot = async () => {
    const allPost = await prisma.post.findMany()
    const randomPost = allPost[Math.floor(Math.random() * allPost.length)]
    const allUser = await prisma.user.findMany()
    const randomUser = allUser[Math.floor(Math.random() * allUser.length)]

    // chiffre entre 1 et 4
    const randomNumberPostInProduct = Math.floor(Math.random() * 3) + 1;

    const newLot = await prisma.lot.create({
        data: {
            name: faker.lorem.words(2),
            posts: {
                connect: {
                    id: randomPost.id
                }
            },
            user: {
                connect: {
                    id: randomUser.id
                }
            }
        }
    })

    for (let i = 0; i < randomNumberPostInProduct; i++) {
        const randomPostSeconde = await getUniquePost(allPost, newLot.id)

        await prisma.lot.update({
            where: {
                id: newLot.id
            },
            data: {
                posts: {
                    connect: {
                        id: randomPostSeconde.id
                    }
                }
            }
        })

    }
};

const generateMessageForLot = async () => {
    const allUser = await prisma.user.findMany({
        include: {
            lot: {
                include: {
                    posts: true,
                    message: true
                }
            }
        }
    })
    const randomUser = allUser[Math.floor(Math.random() * allUser.length)]

    const lotUser = randomUser.lot

    const randomLotInUser = lotUser[Math.floor(Math.random() * lotUser.length)]

    if (lotUser.length > 0 && randomLotInUser && !randomLotInUser.message) {
        const newMessage = await prisma.message.create({
            data: {
                isReadByUser: true,
                isReadByAdmin: false,
                lot: {
                    connect: {
                        id: randomLotInUser.id
                    }
                },
                user: {
                    connect: {
                        id: randomUser.id
                    }
                },
                content: {
                    create: {
                        offerPrice: faker.commerce.price(),
                        content: faker.lorem.sentences({ min: 1, max: 3 }),
                        user: {
                            connect: {
                                id: randomUser.id
                            }
                        }
                    }
                }
            }
        })

        await prisma.lot.update({
            where: {
                id: randomLotInUser.id
            },
            data: {
                messageId: newMessage.id
            }
        })
    }
};

const generateMessageForPost = async () => {
    const allUser = await prisma.user.findMany({
        include: {
            lot: {
                include: {
                    posts: true,
                    message: true
                }
            }
        }
    })
    const randomUser = allUser[Math.floor(Math.random() * allUser.length)]

    const allPost = await prisma.post.findMany()
    const randomPost = allPost[Math.floor(Math.random() * allPost.length)]

    // Vérifier si l'utilisateur a déjà envoyé un message pour ce poste
    const existingMessage = await prisma.message.findFirst({
        where: {
            userId: randomUser.id,
            postId: randomPost.id
        }
    });

    if (existingMessage) {
        console.log(`User ${randomUser.id} has already sent a message for post ${randomPost.id}`);
        return; // Ne pas créer de message si un message existe déjà
    }

    await prisma.message.create({
        data: {
            isReadByUser: true,
            isReadByAdmin: false,
            post: {
                connect: {
                    id: randomPost.id
                }
            },
            user: {
                connect: {
                    id: randomUser.id
                }
            },
            content: {
                create: {
                    offerPrice: faker.commerce.price(),
                    content: faker.lorem.sentences({ min: 1, max: 3 }),
                    user: {
                        connect: {
                            id: randomUser.id
                        }
                    }
                }
            }
        }
    })
};

async function main() {
    await clearDatabase();

    await generateAdmin();

    for (let i = 0; i < 30; i++) {
        await generateFakerUser();
    }

    await generateCategories();

    for (let i = 0; i < 100; i++) {
        await generatePost();
    }

    for (let i = 0; i < 20; i++) {
        await generateLot();
    }

    for (let i = 0; i < 20; i++) {
        if (i % 2 === 0) {
            await generateMessageForLot();
        } else {
            await generateMessageForPost();
        }
    }

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


async function getUniqueAttribute() {
    const sources = [
        { type: 'adjective', method: faker.word.adjective },
        { type: 'color', method: faker.color.human },
        { type: 'words', method: faker.word.words }
    ];

    let uniqueAttribute = null;
    let sourceIndex = 0;

    while (!uniqueAttribute) {
        const source = sources[sourceIndex];
        const randomAttribute = source.method();

        const existingAttribute = await prisma.attribut.findFirst({
            where: { name: randomAttribute }
        });

        if (!existingAttribute) {
            uniqueAttribute = randomAttribute;
        } else {
            sourceIndex = (sourceIndex + 1) % sources.length;

            if (sourceIndex > sources.length) {
                throw new Error('Aucun attribut unique disponible.');
            }
        }
    }

    return uniqueAttribute;
}

async function generateIcode() {
    let uniqueIcode = "";
    while (!uniqueIcode) {
        const randomIcode = Math.floor(Math.random() * 999) + 1;
        const formattedIcode = randomIcode.toString().padStart(3, '0');

        const existingAdjective = await prisma.post.findFirst({
            where: { icode: formattedIcode }
        });

        if (!existingAdjective) {
            uniqueIcode = formattedIcode;
        }
    }
    return uniqueIcode;
}

// Fonction pour générer une date aléatoire entre deux dates
function getRandomDate(startDate: Date, endDate: Date) {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;
    return new Date(randomTimestamp);
}

async function isPostInLot(lotId: string, postId: string) {
    const lot = await prisma.lot.findUnique({
        where: { id: lotId },
        select: {
            posts: {
                where: { id: postId }
            }
        }
    });
    if (!lot) {
        return false;
    }
    return lot.posts.length > 0;
}

async function getUniquePost(allPost: Post[], lotId: string) {
    let uniquePost = null;
    while (!uniquePost) {
        const randomPost = allPost[Math.floor(Math.random() * allPost.length)];
        if (!await isPostInLot(lotId, randomPost.id)) {
            uniquePost = randomPost;
        }
    }
    return uniquePost;
}
