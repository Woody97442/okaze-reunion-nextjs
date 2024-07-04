import * as z from "zod";

export const SendOfferSchema = z.object({
    offer: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().positive({ message: "L'offre doit être supérieure à 0" })
    ),
    message: z.string().min(3, { message: "Un message est requis" }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: "Minimum 6 caractères requis" })
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Un email est requis",
    })
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Un email est requis",
    }),
    password: z.string().min(1, { message: "Un mot de passe est requis" }),
    code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Un email valable est requis",
    }),
    name: z.string().min(3, { message: "Un nom d'utilisateur est requis" }),

    password: z.string().min(6, { message: "" })
        .refine(val => /[A-Z]/.test(val), { message: "" })
        .refine(val => /[0-9]/.test(val), { message: "" })
        .refine(val => /[^a-zA-Z0-9]/.test(val), { message: "" }),

    confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
    message: "Les mots de passe ne sont pas identiques",
    path: ["confirm_password"],
})
