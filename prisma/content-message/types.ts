import { User } from "../user/types";

export type ContentMessage = {
    id: string;
    content: string;
    userId: string;
    user: User;
    offerPrice: string | null;
    createdAt: Date;
    updatedAt: Date;
}
