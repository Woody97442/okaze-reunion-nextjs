import { Post } from "@prisma/client";

export type Favorite = {
    id: string;
    userId: string;
    posts: Post[];
}

