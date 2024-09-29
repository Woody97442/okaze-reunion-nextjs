import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { deleteLot } from "@/actions/lot";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        lot: {
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
        message: {
            update: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("deleteLot", () => {
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

        const result = await deleteLot("lot123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'identifiant utilisateur n'est pas disponible", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({ user: {} });

        const result = await deleteLot("lot123");

        expect(result).toEqual({ error: "utilisateur introuvable !" });
    });

    it("devrait renvoyer une erreur si le lot n'existe pas", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const result = await deleteLot("lot123");

        expect(result).toEqual({ error: "lot introuvable !" });
    });

    it("devrait supprimer un lot si tout est valide et le lot contient un message", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce({
            id: "lot123",
            message: { id: "message123" }
        });
        (prisma.message.update as jest.Mock).mockResolvedValueOnce({});
        (prisma.lot.delete as jest.Mock).mockResolvedValueOnce({});

        const result = await deleteLot("lot123");

        expect(prisma.message.update).toHaveBeenCalledWith({
            where: {
                id: "message123"
            },
            data: {
                lot: {
                    disconnect: true
                },
                isArchived: true
            }
        });

        expect(prisma.lot.delete).toHaveBeenCalledWith({
            where: {
                id: "lot123",
            },
        });

        expect(result).toEqual({ success: "lot supprimé !" });
    });

    it("devrait supprimer un lot si tout est valide et le lot ne contient pas de message", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce({
            id: "lot123",
            message: null
        });
        (prisma.lot.delete as jest.Mock).mockResolvedValueOnce({});

        const result = await deleteLot("lot123");

        expect(prisma.message.update).not.toHaveBeenCalled(); // Vérifie que la mise à jour du message n'a pas été appelée
        expect(prisma.lot.delete).toHaveBeenCalledWith({
            where: {
                id: "lot123",
            },
        });

        expect(result).toEqual({ success: "lot supprimé !" });
    });
});