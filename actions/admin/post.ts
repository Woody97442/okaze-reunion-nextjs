"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Post } from "@/prisma/post/types";
import { $Enums } from "@prisma/client";
import { generateIcode } from "@/lib/token";
import { DeleteImage } from "./delete-image";

const MAX_SEARCH_LENGTH = 100;

export const GetAllPosts = async () => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const posts = await prisma.post.findMany({
        include: {
            categories: true,
            attributs: true,
            images: true
        }
    });

    return posts as Post[];
}

export const CreatePost = async (post: Post) => {

    const title = post.title;
    const description = post.description;
    const price = post.price;
    const state = post.state;

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const icode = await generateIcode();

    try {
        const newPost = await prisma.post.create({
            data: {
                icode,
                title,
                price: Number(price),
                description,
                state: state as $Enums.PostState,
                categories: {
                    connect: post.categories.map((category) => ({
                        id: category.id
                    }))
                },
                attributs: {
                    connect: post.attributs?.map((attribute) => ({
                        id: attribute.id
                    }))
                }
            }
        });

        return { post: newPost, success: "Annonce créé avec succes" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}


export const UpdatePost = async (updateCurrentPost: Post) => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: updateCurrentPost.id
        },
        include: {
            categories: true,
            attributs: true,
            images: true
        }
    });

    if (!existingPost) {
        return { error: "Annonce introuvable !" };
    }

    // Extraire les IDs des catégories et attributs existants
    const existingCategoryIds = existingPost.categories.map(category => category.id);
    const existingAttributeIds = existingPost.attributs.map(attribute => attribute.id);

    // Extraire les IDs des nouvelles catégories et attributs à partir des données mises à jour
    const newCategoryIds = updateCurrentPost.categories.map(category => category.id);
    const newAttributeIds = updateCurrentPost.attributs.map(attribute => attribute.id);

    // Déterminer les IDs à connecter (ajouter)
    const categoriesToConnect = newCategoryIds.filter(id => !existingCategoryIds.includes(id));
    const attributsToConnect = newAttributeIds.filter(id => !existingAttributeIds.includes(id));

    // Déterminer les IDs à déconnecter (retirer)
    const categoriesToDisconnect = existingCategoryIds.filter(id => !newCategoryIds.includes(id));
    const attributsToDisconnect = existingAttributeIds.filter(id => !newAttributeIds.includes(id));


    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: updateCurrentPost.id
            },
            data: {
                title: updateCurrentPost.title,
                description: updateCurrentPost.description,
                price: Number(updateCurrentPost.price),
                state: updateCurrentPost.state as $Enums.PostState,
                // Gérer les catégories
                categories: {
                    connect: categoriesToConnect.map(id => ({ id })),
                    disconnect: categoriesToDisconnect.map(id => ({ id })),
                },

                // Gérer les attributs
                attributs: {
                    connect: attributsToConnect.map(id => ({ id })),
                    disconnect: attributsToDisconnect.map(id => ({ id })),
                }
            },
            include: {
                categories: true,
                attributs: true,
                images: true
            }
        });

        // Mise a jour des alt des images

        await prisma.image.updateMany({
            where: {
                postId: updatedPost.id
            },
            data: {
                alt: "image de l'annonce " + updatedPost.title
            }
        });

        return { post: updatedPost, success: "Annonce mise à jour avec succès" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}

export const DeletePost = async (postId: string) => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            categories: true,
            attributs: true,
            images: true
        }
    });

    if (!existingPost) {
        return { error: "Annonce introuvable !" };
    }

    try {
        let erreorDeletedImagePost = false
        // Si il y a des images dans le post, les supprimer
        if (existingPost.images.length > 0) {
            for (let i = 0; i < existingPost.images.length; i++) {
                const imageDeleted = await DeleteImage(existingPost.images[i]);
                if (imageDeleted.error) {
                    erreorDeletedImagePost = true;
                }
            }
        }

        if (erreorDeletedImagePost) {
            return { error: "Une erreur est survenue par la suppression des images !" };
        }

        await prisma.lot.findMany({
            include: {
                posts: true
            }
        }).then(async (lots) => {
            for (let i = 0; i < lots.length; i++) {
                if (lots[i].posts.some((post) => post.id === postId)) {
                    await prisma.lot.update({
                        where: {
                            id: lots[i].id
                        },
                        data: {
                            hasPostsEcluded: true
                        }
                    });
                }
                if (lots[i].posts.length === 1) {
                    await prisma.lot.delete({
                        where: {
                            id: lots[i].id
                        }
                    });
                }
            }
        });

        // Supprimer l'entrée de la base de données
        await prisma.post.delete({
            where: {
                id: postId
            }
        });

        return { post: [], success: "Annonce supprimé avec succès" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}

export const ActivePost = async (postId: string) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if (!existingPost) {
        return { error: "Annonce introuvable !" };
    }

    try {

        // Modifier l'activation de l'annonce
        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                isActive: !existingPost.isActive
            },
            include: {
                categories: true,
                attributs: true,
                images: true
            }
        });
        if (!updatedPost) {
            return { error: "Une erreur est survenue !" };
        }

        if (updatedPost.isActive) {
            return { post: updatedPost, success: "Annonce activée avec succès" };
        } else {
            return { post: updatedPost, success: "Annonce désactivée avec succès" };
        }

    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }
}

export const GetPostsForSearchBar = async (termes: string) => {
    try {

        // Valider et assainir les termes de recherche
        const searchQuery = validator(termes.trim());

        if (searchQuery.length > MAX_SEARCH_LENGTH) {
            throw new Error('La requête de recherche est trop longue.');
        }

        // Retourne 5 post qui correspondent à la recherche
        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: searchQuery
                },
                isActive: true
            },
            take: 5,
            include: {
                categories: true,
                attributs: true,
                images: true
            }
        });

        return posts as Post[];

    } catch (error) {
        console.error('Erreur lors de la recherche des Annonces:', error);
        throw new Error('Une erreur est survenue lors de la recherche.');
    }
}

const validator = (value: string) => {
    const sanitizedValue = value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    return sanitizedValue.trim();
}

export const UpdateCoverImagePost = async (idPost: string, coverIndex: number) => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: idPost
        },
        include: {
            categories: true,
            attributs: true,
            images: true
        }
    });

    if (!existingPost) {
        return { error: "Annonce introuvable !" };
    }

    try {
        await prisma.post.update({
            where: {
                id: existingPost.id
            },
            data: {
                coverImageIndex: coverIndex
            }
        });

        return { success: "Image de couverture mise à jour avec succès" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}