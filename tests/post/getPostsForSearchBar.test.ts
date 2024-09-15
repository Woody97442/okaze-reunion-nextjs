import { GetPostsForSearchBar } from "@/actions/admin/post";
import { prisma } from "@/prisma/prismaClient";

// Mocking Prisma client
jest.mock("@/prisma/prismaClient", () => ({
    prisma: {
        post: {
            findMany: jest.fn(),
        },
    },
}));

describe("GetPostsForSearchBar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait renvoyer une erreur si la requête est trop longue", async () => {
        await expect(GetPostsForSearchBar("a".repeat(101))).rejects.toThrow('La requête de recherche est trop longue.');
    });

    it("devrait retourner les posts correspondant à la recherche", async () => {
        const mockPosts = [
            { id: "post1", title: "Post 1" },
            { id: "post2", title: "Post 2" },
        ];

        (prisma.post.findMany as jest.Mock).mockResolvedValueOnce(mockPosts);

        const result = await GetPostsForSearchBar("Post");

        expect(prisma.post.findMany).toHaveBeenCalledWith({
            where: {
                title: { contains: "Post" },
                isActive: true,
            },
            take: 10,
            include: {
                categories: true,
                attributs: true,
                images: true,
            },
        });

        expect(result).toEqual(mockPosts);
    });
});