"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Message } from "@/prisma/message/types";

export const GetAllMessages = async () => {

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

    const messages = await prisma.message.findMany({
        include: {
            lot: {
                include: {
                    user: true,
                    posts: {
                        include: {
                            images: true
                        }
                    }
                }
            },
            user: true,
            content: {
                include: {
                    user: true
                }
            },
            post: {
                include: {
                    images: true
                }
            }
        }
    });

    return messages as unknown as Message[];
}

export const SendNewMessageAdmin = async (formData: FormData) => {
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
                isReadByUser: false,
            },
            include: {
                content: {
                    include: {
                        user: true,
                    },
                },
                user: true,
                lot: {
                    include: {
                        user: true,
                        posts: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                post: {
                    include: {
                        images: true
                    }
                }
            },
        });
        return { newContentMessage: updateMessage, success: "Message envoyé !" };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Une erreur est survenue !" };
    }

}

export const ArchivedMessageAdmin = async (idMessage: string) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }


    const existingMessage = await prisma.message.findUnique({
        where: {
            id: idMessage
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
                isArchived: true,
            },
            include: {
                content: {
                    include: {
                        user: true,
                    },
                },
                lot: {
                    include: {
                        user: true,
                        posts: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                user: true,
                post: {
                    include: {
                        images: true
                    }
                }
            },
        });
        return { messageArchived: updateMessage, success: "Message archivé !" };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Une erreur est survenue !" };
    }

}

export const SwitchReadMessageByAdmin = async (idMessage: string) => {
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
        // Mise a jour de la valeur de lecture du message
        const updateMessage = await prisma.message.update({
            where: {
                id: idMessage,
            },
            data: {
                isReadByAdmin: true,
            },
            include: {
                content: {
                    include: {
                        user: true,
                    },
                },
                lot: {
                    include: {
                        user: true,
                        posts: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                user: true,
                post: {
                    include: {
                        images: true
                    }
                }
            },
        });
        return { updateReadMessage: updateMessage, success: "Message lu !" };
    } catch (error) {
        console.error("Error read message:", error);
        return { error: "Une erreur est survenue !" };
    }
}