import { Category, Attribut, $Enums, Image, Favorite } from '@prisma/client';

export type Post = {
    id: string
    icode: string
    title: string
    price: number
    description: string | null
    isActive: boolean

    state: $Enums.PostState

    coverImageIndex: number
    categories: Category[]
    attributs: Attribut[]
    images: Image[]
    favorites: Favorite[]

    createdAt: Date
    updatedAt: Date
}

