import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { GetAllPosts } from "@/actions/admin/post";

// Mocking Prisma client and auth
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        post: {
            findMany: jest.fn(),
        },
    },
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

describe("GetAllPosts", () => {
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

        const result = await GetAllPosts();

        expect(result).toEqual({ error: "Veuillez vous connecter !" });
    });

    it("devrait renvoyer une erreur si l'utilisateur n'est pas administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce({
            user: {
                id: "user123",
                role: "USER",
            },
        });

        const result = await GetAllPosts();

        expect(result).toEqual({ error: "Vous n'avez pas les droits administrateurs !" });
    });

    it("devrait retourner tous les posts si l'utilisateur est administrateur", async () => {
        (auth as jest.Mock).mockResolvedValueOnce(mockSession);

        const mockPosts = [
            { id: "post1", title: "Post 1" },
            { id: "post2", title: "Post 2" },
        ];

        (prisma.post.findMany as jest.Mock).mockResolvedValueOnce(mockPosts);

        const result = await GetAllPosts();

        expect(result).toEqual(mockPosts);
    });
});