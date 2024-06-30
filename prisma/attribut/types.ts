import { Post } from '@prisma/client';

export type Attribut = {
    id: string
    name: string
    posts: Post[]
}