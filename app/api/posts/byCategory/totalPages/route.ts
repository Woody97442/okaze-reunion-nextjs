import { NextResponse } from "next/server";
import { getTotalPagesByCategory } from "@/data/post";


// Route pour récupérer le nombre total de pages de post d'une catégorie
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

        if (categoryId) {
            const totalPages = await getTotalPagesByCategory(categoryId, pageSize);
            return NextResponse.json({ totalPages }, { status: 200 });
        }

        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    } catch (error) {
        console.error("Error in GET /api/posts/byCategory/totalPages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}