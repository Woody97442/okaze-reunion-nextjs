import { NextResponse } from "next/server";
import { getPostById, getPosts } from "@/data/post";

// Route pour récupérer un post par ID ou tout les posts
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const post = await getPostById(id);
            if (!post) {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }
            return NextResponse.json(post, { status: 200 });
        }

        const posts = await getPosts();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
