import { getCategories, getCategoryById } from "@/data/category";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const category = await getCategoryById(id);
            return NextResponse.json(category, { status: 200 });
        }

        const categories = await getCategories();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
