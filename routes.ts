
const routesAPIPublic = [
    "/api/categories",
    "/api/posts",
]

const publicPages = [
    "/",
    "/auth/new-verification",
    "/category",
    "/post",

]

/**
 * Les Routes accessibles au public
 * Ces Routes ne nécessitent pas d'authentification
 * @type {string[]}
 */
export const publicRoutes = [
    ...publicPages,
    ...routesAPIPublic
]

/**
 * Les Routes utilisées pour l'authentification
 * Ces Routes redirigeront les utilisateurs connectés vers /
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
]


/**
 * Le préfixe des routes d'authentification API
 * Les routes commençant par ce préfixe sont utilisées à des fins d'authentification API
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Le routes de redirection par défaut après la connexion
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/"