import { Post } from '@prisma/client';

export type CategoryWithPosts = {
    id: string;
    name: string;
    icon: string;
    altIcon: string | null;
    createdAt: Date;
    updatedAt: Date;
    posts: Post[];
} | null | undefined;