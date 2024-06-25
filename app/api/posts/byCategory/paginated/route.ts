import { NextResponse } from "next/server";
import { getPaginatedPosts } from "@/data/post";


// Route pour récupérer les posts paginés d'une catégorie
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
        const orderBy = searchParams.get("orderBy") || "recent";

        if (categoryId) {
            const posts = await getPaginatedPosts(categoryId, page, pageSize, orderBy);
            return NextResponse.json(posts, { status: 200 });
        }

        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    } catch (error) {
        console.error("Error in GET /api/posts/byCategory/paginated:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}