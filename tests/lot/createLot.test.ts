import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { createLot } from "@/actions/lot";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        lot: {
            create: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("createLot", () => {
    const mockSession = {
        user: {
            id: "user123",
        },
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas authentifié", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(null);

        const result = await createLot("LotName", "post123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'identifiant utilisateur n'est pas disponible", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({ user: {} });

        const result = await createLot("LotName", "post123");

        expect(result).toEqual({ error: "utilisateur introuvable !" });
    });

    it("devrait créer un nouveau lot si l'utilisateur est authentifié", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);

        const mockLot = {
            id: "lot123",
            name: "LotName",
            posts: [{ id: "post123", images: [] }],
        };

        (prisma.lot.create as jest.Mock).mockResolvedValueOnce(mockLot);

        const result = await createLot("LotName", "post123");

        expect(prisma.lot.create).toHaveBeenCalledWith({
            data: {
                name: "LotName",
                user: {
                    connect: {
                        id: "user123",
                    },
                },
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
            lot: mockLot,
            success: "Nouveau lot creé !",
        });
    });
});