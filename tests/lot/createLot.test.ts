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

    it("should return error if user is not authenticated", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(null);

        const result = await createLot("LotName", "post123");

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("should return error if userId is not available", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({ user: {} });

        const result = await createLot("LotName", "post123");

        expect(result).toEqual({ error: "utilisateur introuvable !" });
    });

    it("should create a new lot if user is authenticated", async () => {
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