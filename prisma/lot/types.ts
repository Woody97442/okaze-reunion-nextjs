import { Post } from "@/prisma/post/types"

export type Lot = {
    id: string
    name: string
    userId: string
    hasPostsEcluded: boolean
    posts: Post[]
} 