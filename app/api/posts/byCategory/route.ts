import { NextResponse } from "next/server";
import { getPostsByCategoryId } from "@/data/post";


// Route pour récupérer tous les posts d'une catégorie par son ID
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");

        if (categoryId) {
            const posts = await getPostsByCategoryId(categoryId);
            return NextResponse.json(posts, { status: 200 });
        }

        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    } catch (error) {
        console.error("Error in GET /api/posts/byCategory:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}