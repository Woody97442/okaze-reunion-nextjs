import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from "@/prisma/prismaClient";
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateTwoFactorToken = async (email: string) => {

    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await prisma.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            token,
            expires,
            email
        }
    })

    return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            token,
            expires,
            email
        }
    })
    return verificationToken
}

export const generateIcode = async () => {
    // Fonction pour générer un code aléatoire entre 001 et 999
    const generateRandomCode = () => {
        return String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    };

    let uniqueCode = generateRandomCode();

    while (true) {
        // Vérifier si le code existe déjà dans la base de données
        const existingIcode = await prisma.post.findFirst({
            where: {
                icode: uniqueCode
            }
        });

        if (!existingIcode) {
            // Code unique trouvé, sortir de la boucle
            break;
        }

        // Générer un nouveau code si celui-ci existe déjà
        uniqueCode = generateRandomCode();
    }

    return uniqueCode;
};

export default generateIcode;
