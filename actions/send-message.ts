"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";

export const CreateMessage = async (formData: FormData) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const offerPrice: string = formData.get("offer") as string;
    const message: string = formData.get("message") as string;
    const lotId: string = formData.get("lotId") as string;

    const exitingLot = await prisma.lot.findUnique({
        where: {
            id: lotId
        },
        include: {
            message: true
        }
    })


    if (!exitingLot) {
        return { error: "lot introuvable si le probleme persiste contactez l'administrateur !" }
    }

    if (exitingLot.message?.id) {
        return { error: "Vous avez deja fait une offre pour ce lot !" }
    }

    if (!offerPrice || !message || !lotId) {
        return { error: "Veuillez renseigner tous les champs !" };
    }

    try {
        // Creation d'une conversation
        const newMessage = await prisma.message.create({
            data: {
                content: {
                    create: {
                        content: message,
                        offerPrice: offerPrice,
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                },
                lot: {
                    connect: {
                        id: lotId
                    }
                }
            }
        })
        return { newMessage: newMessage, success: "Offre envoyée !" };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Une erreur est survenue !" };
    }



}


export const SendNewMessage = async (formData: FormData) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const newMessage: string = formData.get("message") as string;

    if (!newMessage) {
        return { error: "Veuillez renseigner tous les champs !" };
    }

    const idMessage = formData.get("currentMessageId") as string;

    const existingMessage = await prisma.message.findUnique({
        where: {
            id: idMessage
        },
        include: {
            lot: true
        }
    })

    if (!existingMessage) {
        return { error: "Message introuvable !" }
    }

    try {
        // Mise a jour de la conversation
        const updateMessage = await prisma.message.update({
            where: {
                id: idMessage,
            },
            data: {
                content: {
                    create: {
                        content: newMessage,
                        user: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                },
            },
            include: {
                content: {
                    include: {
                        user: true,
                    },
                },
                lot: true
            },
        });
        return { newContentMessage: updateMessage, success: "Message envoyé !" };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Une erreur est survenue !" };
    }

}