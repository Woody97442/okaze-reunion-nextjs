import prisma from "./prisma";

export const getUsers = async () => {
    return await prisma.user.findMany();
};

export const getUsersById = async (id: number) => {
    return await prisma.user.findUnique({ where: { id } });
};