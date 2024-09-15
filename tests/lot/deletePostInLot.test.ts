import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { deletePostInLot } from "@/actions/lot";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        lot: {
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        post: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("deletePostInLot", () => {
    const mockSession = {
        user: {
            id: "user123",
        },
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas authentifié", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(null);

        const result = await deletePostInLot("post123", "lot123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'identifiant utilisateur n'est pas disponible", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({ user: {} });

        const result = await deletePostInLot("post123", "lot123");

        expect(result).toEqual({ error: "utilisateur introuvable !" });
    });

    it("devrait renvoyer une erreur si le lot n'existe pas", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const result = await deletePostInLot("post123", "lot123");

        expect(result).toEqual({ error: "lot introuvable !" });
    });

    it("devrait renvoyer une erreur si le post n'existe pas", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce({ id: "lot123" });
        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const result = await deletePostInLot("post123", "lot123");

        expect(result).toEqual({ error: "Annonce introuvable !" });
    });

    it("devrait supprimer le post du lot et supprimer le lot si le lot est vide après la suppression du post", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce({
            id: "lot123",
            posts: [{ id: "post123" }],
        });
        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: "post123" });
        (prisma.lot.update as jest.Mock).mockResolvedValueOnce({
            id: "lot123",
            posts: [],
        });
        (prisma.lot.delete as jest.Mock).mockResolvedValueOnce({});

        const result = await deletePostInLot("post123", "lot123");

        expect(prisma.lot.update).toHaveBeenCalledWith({
            where: { id: "lot123" },
            data: { posts: { disconnect: { id: "post123" } } },
            include: {
                posts: {
                    include: {
                        images: true,
                        categories: true,
                        attributs: true,
                        favorites: true,
                    },
                },
            },
        });

        expect(prisma.lot.delete).toHaveBeenCalledWith({
            where: { id: "lot123" },
        });

        expect(result).toEqual({
            delete: true,
            lot: null,
            success: "lot vide supprimé !",
        });
    });

    it("devrait supprimer le post du lot sans supprimer le lot si le lot n'est pas vide après la suppression du post", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce({
            id: "lot123",
            posts: [{ id: "post123" }, { id: "post456" }],
        });
        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: "post123" });
        (prisma.lot.update as jest.Mock).mockResolvedValueOnce({
            id: "lot123",
            posts: [{ id: "post456" }],
        });

        const result = await deletePostInLot("post123", "lot123");

        expect(prisma.lot.update).toHaveBeenCalledWith({
            where: { id: "lot123" },
            data: { posts: { disconnect: { id: "post123" } } },
            include: {
                posts: {
                    include: {
                        images: true,
                        categories: true,
                        attributs: true,
                        favorites: true,
                    },
                },
            },
        });

        expect(prisma.lot.delete).not.toHaveBeenCalled(); // Vérifie que le lot n'a pas été supprimé

        expect(result).toEqual({
            delete: false,
            lot: { id: "lot123", posts: [{ id: "post456" }] },
            success: "Annonce supprimé !",
        });
    });
});