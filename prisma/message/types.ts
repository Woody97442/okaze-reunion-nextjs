import { ContentMessage } from "../content-message/types";
import { Lot } from "../lot/types";
import { User } from "../user/types";

export type Message = {
    id: string;
    userId: string;
    user: User;
    lot: Lot | null;
    content: ContentMessage[];
    isArchived: boolean;
    isReadByUser: boolean;
    isReadByAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
