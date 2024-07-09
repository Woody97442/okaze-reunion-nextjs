import { Post } from '@prisma/client';

export type Category = {
    id: string
    name: string
    icon: string | null
    altIcon: string | null

    posts: Post[]

    createdAt: Date
    updatedAt: Date
}

export type NavCategory = {
    id: string;
    name: string;
    icon: string | null;
    altIcon: string | null;
}