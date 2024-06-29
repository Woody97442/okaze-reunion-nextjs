import { Category, Attribut, $Enums } from '@prisma/client';

export type Post = {
    id: string
    icode: string
    title: string
    price: number
    description: string | null
    image: string | null
    imageAlt: string | null
    state: $Enums.PostState
    createdAt: Date
    updatedAt: Date
    categories: Category[]
    attributs: Attribut[]
}

