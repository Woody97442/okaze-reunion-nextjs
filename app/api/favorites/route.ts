import { isFavorite } from "@/data/favorite";
import { NextResponse } from "next/server";

// Route pour savoire si un post est dans les favoris
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 404 });
        }

        const isFavoritePost = await isFavorite(id);

        return NextResponse.json(isFavoritePost, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
