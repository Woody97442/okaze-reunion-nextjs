import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { addToLot } from "@/actions/lot";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        lot: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        post: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("addToLot", () => {
    const mockSession = {
        user: {
            id: "user123",
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return error if user is not authenticated", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(null);

        const result = await addToLot("lot123", "post123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("should return error if lot does not exist", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const result = await addToLot("lot123", "post123");

        expect(result).toEqual({ error: "lot introuvable !" });
    });

    it("should return error if post does not exist", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock).mockResolvedValueOnce({ id: "lot123" });
        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const result = await addToLot("lot123", "post123");

        expect(result).toEqual({ error: "Annonce introuvable !" });
    });

    it("should add post to lot if everything is valid", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.lot.findUnique as jest.Mock)
            .mockResolvedValueOnce({ id: "lot123", posts: [] }) // Vérifier si le post existe déjà dans le lot
            .mockResolvedValueOnce({ id: "lot123" }); // Récupérer le lot existant

        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: "post123" });

        const mockUpdatedLot = { id: "lot123", posts: [{ id: "post123", images: [] }] };

        (prisma.lot.update as jest.Mock).mockResolvedValueOnce(mockUpdatedLot);

        const result = await addToLot("lot123", "post123");

        expect(prisma.lot.update).toHaveBeenCalledWith({
            where: {
                id: "lot123",
            },
            data: {
                posts: {
                    connect: {
                        id: "post123",
                    },
                },
            },
            include: {
                posts: {
                    include: {
                        images: true,
                    },
                },
            },
        });

        expect(result).toEqual({
            lot: mockUpdatedLot,
            success: "Ajout au lot !",
        });
    });
});