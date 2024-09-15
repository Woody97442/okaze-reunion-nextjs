import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { UpdatePost } from "@/actions/admin/post";
import { $Enums } from "@prisma/client";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        post: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        image: {
            updateMany: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("UpdatePost", () => {
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

        const result = await UpdatePost({
            id: "post123",
            title: "Updated Title",
            icode: "icode123",
            price: 100,
            description: "Updated Description",
            isActive: true,
            state: $Enums.PostState.new,
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

        const result = await UpdatePost({
            id: "post123",
            title: "Updated Title",
            icode: "icode123",
            price: 100,
            description: "Updated Description",
            isActive: true,
            state: $Enums.PostState.new,
            categories: [],
            attributs: [],
            images: [],
            favorites: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(result).toEqual({ error: "Vous n'avez pas les droits administrateurs !" });
    });

    it("devrait mettre à jour un post si l'utilisateur est administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);

        const mockExistingPost = {
            id: "post123",
            title: "Old Title",
            description: "Old Description",
            price: 100,
            state: $Enums.PostState.new,
            categories: [{ id: "cat1" }],
            attributs: [{ id: "attr1" }],
            images: [{ id: "img1", alt: "" }],
        };

        const mockUpdatedPost = {
            id: "post123",
            title: "Updated Title",
            description: "Updated Description",
            price: 200,
            state: $Enums.PostState.new,
            categories: [{ id: "cat2" }],
            attributs: [{ id: "attr2" }],
            images: [{ id: "img1", alt: "image de l'annonce Updated Title" }],
        };

        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(mockExistingPost);
        (prisma.post.update as jest.Mock).mockResolvedValueOnce(mockUpdatedPost);
        (prisma.image.updateMany as jest.Mock).mockResolvedValueOnce({ count: 1 });

        const result = await UpdatePost({
            id: "post123",
            title: "Updated Title",
            description: "Updated Description",
            price: 200,
            state: $Enums.PostState.new,
            categories: [{
                id: "cat2",
                name: "",
                icon: null,
                altIcon: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }],
            attributs: [{
                id: "attr2",
                name: ""
            }],
            images: [{
                id: "img1", alt: "image de l'annonce Updated Title",
                src: "",
                extension: "",
                postId: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            }],
            icode: "",
            isActive: false,
            favorites: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        expect(prisma.post.update).toHaveBeenCalledWith({
            where: { id: "post123" },
            data: {
                title: "Updated Title",
                description: "Updated Description",
                price: 200,
                state: $Enums.PostState.new,
                categories: {
                    connect: [{ id: "cat2" }],
                    disconnect: [{ id: "cat1" }],
                },
                attributs: {
                    connect: [{ id: "attr2" }],
                    disconnect: [{ id: "attr1" }],
                },
            },
            include: {
                categories: true,
                attributs: true,
                images: true,
            },
        });

        expect(result).toEqual({ post: mockUpdatedPost, success: "Annonce mise à jour avec succès" });
    });
});