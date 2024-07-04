import { Lot } from "@/prisma/lot/types";

export function TotalPriceLot(lot: Lot): number {
    let total = 0;
    lot.posts.forEach((post) => {
        total += post.price;
    });
    return total;
};