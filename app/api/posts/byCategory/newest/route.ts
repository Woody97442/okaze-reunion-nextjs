import { NextResponse } from "next/server";
import { getNewestPostsByCategory } from "@/data/post";


// Route pour récupérer les derniers posts par catégorie
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        if (categoryId) {
            const posts = await getNewestPostsByCategory(categoryId, limit);
            return NextResponse.json(posts, { status: 200 });
        }

        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    } catch (error) {
        console.error("Error in GET /api/posts/byCategory/newest:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}