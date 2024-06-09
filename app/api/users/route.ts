import { getUsers, getUsersById } from "@/prisma/users";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (id) {
            const category = await getUsersById(parseInt(id));
            return NextResponse.json(category, { status: 200 });
        }
        const categories = await getUsers();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}