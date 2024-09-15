import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { DeletePost } from "@/actions/admin/post";
import { DeleteImage } from "@/actions/admin/delete-image";

// Mocking Prisma client, auth and DeleteImage
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        post: {
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
        lot: {
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

jest.mock("@/actions/admin/delete-image", () => ({
    DeleteImage: jest.fn(),
}));

describe("DeletePost", () => {
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

        const result = await DeletePost("post123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({
            user: {
                id: "user123",
                role: "USER",
            },
        });

        const result = await DeletePost("post123");

        expect(result).toEqual({ error: "Vous n'avez pas les droits administrateurs !" });
    });

    it("devrait supprimer un post si l'utilisateur est administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);

        const mockPost = {
            id: "post123",
            images: [{ id: "img1" }],
        };

        const mockLots = [{ id: "lot1", posts: [{ id: "post123" }] }];

        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(mockPost);
        (prisma.lot.findMany as jest.Mock).mockResolvedValueOnce(mockLots);
        (prisma.lot.update as jest.Mock).mockResolvedValueOnce({});
        (prisma.lot.delete as jest.Mock).mockResolvedValueOnce({});
        (DeleteImage as jest.Mock).mockResolvedValueOnce({});

        const result = await DeletePost("post123");

        expect(DeleteImage).toHaveBeenCalledWith(mockPost.images[0]);
        expect(prisma.lot.update).toHaveBeenCalledWith({
            where: { id: "lot1" },
            data: { hasPostsEcluded: true },
        });
        expect(prisma.lot.delete).toHaveBeenCalledWith({ where: { id: "lot1" } });
        expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: "post123" } });

        expect(result).toEqual({ post: [], success: "Annonce supprimé avec succes" });
    });
});