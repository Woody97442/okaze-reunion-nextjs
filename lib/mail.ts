import PasswordResetTemplate from "@/emails/password-reset-template";
import TwoFactorTokenTemplate from "@/emails/two-factor-token-template";
import VerificationEmailTemplate from "@/emails/verification-email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    const resendEmail = process.env.RESEND_FROM_EMAIL

    await resend.emails.send({
        from: resendEmail!,
        to: email,
        subject: "Validation en Deux Étapes",
        react: TwoFactorTokenTemplate({ email, token }),
    });
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
    const resendEmail = process.env.RESEND_FROM_EMAIL

    await resend.emails.send({
        from: resendEmail!,
        to: email,
        subject: "Réinitialiser votre mot de passe",
        react: PasswordResetTemplate({ email, resetLink }),
    });
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
    const resendEmail = process.env.RESEND_FROM_EMAIL
    await resend.emails.send({
        from: resendEmail!,
        to: email,
        subject: "Confirmer votre email",
        react: VerificationEmailTemplate({ email, confirmLink }),
    });
}