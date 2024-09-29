import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { ActivePost } from "@/actions/admin/post";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        post: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("ActivePost", () => {
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

        const result = await ActivePost("post123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({
            user: {
                id: "user123",
                role: "USER",
            },
        });

        const result = await ActivePost("post123");

        expect(result).toEqual({ error: "Vous n'avez pas les droits administrateurs !" });
    });

    it("devrait activer/désactiver un post si l'utilisateur est administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);

        const mockPost = {
            id: "post123",
            isActive: false,
        };

        const mockUpdatedPost = {
            id: "post123",
            isActive: true,
        };

        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(mockPost);
        (prisma.post.update as jest.Mock).mockResolvedValueOnce(mockUpdatedPost);

        const result = await ActivePost("post123");

        expect(prisma.post.update).toHaveBeenCalledWith({
            where: { id: "post123" },
            data: { isActive: true },
            include: {
                categories: true,
                attributs: true,
                images: true,
            },
        });

        expect(result).toEqual({ post: mockUpdatedPost, success: "Annonce activée avec succès" });
    });
});