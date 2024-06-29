import { Post } from "@/prisma/post/types";

export function FilterPosts(post: Post, searchTerm: string, selectedAttribute: string, minPrice: number, maxPrice: number, listState: string[]) {

    // Filtrer par prix
    let matchesPrice = true;
    if (minPrice > 0 || maxPrice > 0) {
        // Inverser min et max si min est supérieur à max
        if (minPrice > maxPrice) {
            [minPrice, maxPrice] = [maxPrice, minPrice];
        }

        // Vérifier que le prix de l'article est dans la plage spécifiée
        matchesPrice = post.price >= minPrice && post.price <= maxPrice;
    }

    // Filtre par titre ou description comme avant
    const matchesSearch =
        (post &&
            post.title &&
            post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.description &&
            post.description.toLowerCase().includes(searchTerm.toLowerCase()));


    // Filtre par attribut sélectionné
    const matchesAttribute =
        selectedAttribute === "default" ||
        (post.attributs &&
            post.attributs.some(
                (attribut) =>
                    attribut.name.toLowerCase() === selectedAttribute.toLowerCase()
            ));

    // Filtre par statut
    let matchesState = true;
    if (listState.length > 0) {
        const matchesState = listState.some(
            (state) => state === post.state
        );
        if (!matchesState) {
            return false;
        }
    }

    return matchesSearch && matchesAttribute && matchesPrice && matchesState;
};

export function SortPosts(posts: Post[], orderBy: string) {
    switch (orderBy) {
        case "recent":
            return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case "oldest":
            return posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case "priceLow":
            return posts.sort((a, b) => a.price - b.price);
        case "priceHigh":
            return posts.sort((a, b) => b.price - a.price);
        default:
            return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
}