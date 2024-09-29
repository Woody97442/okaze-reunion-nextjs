import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { CreatePost } from "@/actions/admin/post";
import { $Enums } from "@prisma/client";

// Mocking Prisma client, auth and generateIcode
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        post: {
            create: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

jest.mock("@/lib/token", () => ({
    generateIcode: jest.fn(() => "icode123"),  // Mock correct de la génération de l'icode
}));

describe("CreatePost", () => {
    const mockSession = {
        user: {
            id: "user123",
            role: "ADMIN",
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas authentifié", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(null);

        const result = await CreatePost({
            id: "post123",
            icode: "111",
            title: "Sample Post",
            price: 100,
            description: "Post description",
            isActive: true,
            state: $Enums.PostState.new, // Utilisation correcte de l'état
            categories: [],
            attributs: [],
            images: [],
            favorites: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({
            user: {
                id: "user123",
                role: "USER",
            },
        });

        const result = await CreatePost({
            id: "post123",
            icode: "",
            title: "Sample Post",
            price: 100,
            description: "Post description",
            isActive: true,
            state: $Enums.PostState.new, // Utilisation correcte de l'état
            categories: [],
            attributs: [],
            images: [],
            favorites: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(result).toEqual({ error: "Vous n'avez pas les droits administrateurs !" });
    });

    it("devrait créer un post si l'utilisateur est administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);

        const mockPost = {
            id: "post123",
            icode: "icode123",  // Valeur correcte pour l'icode
            title: "Sample Post",
            price: 100,
            description: "Post description",
            isActive: true,
            state: $Enums.PostState.new, // Utilisation correcte de l'état
            categories: [],
            attributs: [],
            images: [],
            favorites: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (prisma.post.create as jest.Mock).mockResolvedValueOnce(mockPost);

        const result = await CreatePost({
            id: "post123",
            icode: "111",
            title: "Sample Post",
            price: 100,
            description: "Post description",
            isActive: true,
            state: $Enums.PostState.new, // Utilisation correcte de l'état
            categories: [],
            attributs: [],
            images: [],
            favorites: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(prisma.post.create).toHaveBeenCalledWith({
            data: {
                icode: "icode123",  // Le code généré par generateIcode est maintenant correct
                title: "Sample Post",  // Utiliser les valeurs correctes
                price: 100,
                description: "Post description",
                state: $Enums.PostState.new,  // État correct
                categories: {
                    connect: [],
                },
                attributs: {
                    connect: [],
                },
            },
        });

        expect(result).toEqual({ post: mockPost, success: "Annonce créé avec succes" });
    });
});