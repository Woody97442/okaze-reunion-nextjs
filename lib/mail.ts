import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    const resendEmail = process.env.RESEND_FROM_EMAIL

    await resend.emails.send({
        from: resendEmail!,
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code is: ${token}</p>`,
    });
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
    const resendEmail = process.env.RESEND_FROM_EMAIL

    await resend.emails.send({
        from: resendEmail!,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
    const resendEmail = process.env.RESEND_FROM_EMAIL
    await resend.emails.send({
        from: resendEmail!,
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
}