import { Post } from '@prisma/client';

export type Category = {
    id: string
    name: string
    icon: string | null
    altIcon: string | null
    createdAt: Date
    updatedAt: Date
    posts: Post[]
} | null | undefined
