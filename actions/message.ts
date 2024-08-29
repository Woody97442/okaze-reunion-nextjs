"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import nodemailer from 'nodemailer';

export const CreateMessage = async (formData: FormData) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const currentUserId = session.user.id;

    if (!currentUserId) {
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
                                id: currentUserId
                            }
                        }
                    }
                },
                isReadByAdmin: false,
                isReadByUser: true,
                user: {
                    connect: {
                        id: currentUserId
                    }
                },
                lot: {
                    connect: {
                        id: lotId
                    }
                }
            }, include: {
                lot: true,
                content: true
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

    const currentUserId = session.user.id;

    if (!currentUserId) {
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
                                id: currentUserId,
                            },
                        },
                    },
                },
                isReadByAdmin: false,
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

export const ArchivedMessage = async (idMessage: string) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const currentUserId = session.user.id;

    if (!currentUserId) {
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
        });
        return { messageArchived: updateMessage, success: "Message archivé !" };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Une erreur est survenue !" };
    }

}

export const SwitchReadMessageByUser = async (idMessage: string) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const currentUserId = session.user.id;

    if (!currentUserId) {
        return { error: "utilisateur introuvable !" };
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
                isReadByUser: true,
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

export const CreateMessagePost = async (formData: FormData) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const currentUserId = session.user.id;

    if (!currentUserId) {
        return { error: "utilisateur introuvable !" };
    }

    let offerPrice: string = formData.get("offer") as string;
    const message: string = formData.get("message") as string;
    const postId: string = formData.get("postId") as string;

    const exitingPost = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            messages: true
        }
    })

    if (offerPrice === "") {
        offerPrice = exitingPost?.price.toString() as string
    }

    if (!exitingPost) {
        return { error: "annonce introuvable si le probleme persiste contactez l'administrateur !" }
    }

    if (exitingPost.messages?.some((message) => message.userId === currentUserId)) {
        return { error: "Vous avez deja fait une offre pour ce lot !" }
    }

    if (!message || !postId) {
        return { error: "Le message et obligatoire !" };
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
                                id: currentUserId
                            }
                        }
                    }
                },
                isReadByAdmin: false,
                isReadByUser: true,
                user: {
                    connect: {
                        id: currentUserId
                    }
                },
                post: {
                    connect: {
                        id: postId
                    }
                }
            }, include: {
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
                },
                content: {
                    include: {
                        user: true,
                    },
                },
            }
        })
        return { newMessage: newMessage, success: "Message envoyée !" };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Une erreur est survenue !" };
    }

}

export const sendContactMessage = async (formData: FormData) => {

    // Récupérer les données du formulaire
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Configurer le transporteur SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Configurer l'e-mail
    const mailOptions = {
        from: `${name} <${email}>`,
        to: 'okaze.reunion@gmail.com',
        subject: "Nouveau message d'un utilisateur",
        text: `Vous avez reçu un nouveau message de l'utilisateur ${name} (${email}):\n\n${message}`,
    };

    try {
        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);
        return { success: 'Message envoyé !' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        return { error: 'Une erreur est survenue lors de l\'envoi du message !' };
    }
}