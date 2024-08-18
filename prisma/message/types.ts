import { ContentMessage } from "../content-message/types";
import { Lot } from "../lot/types";

export type Message = {
    id: string;
    userId: string;
    lot: Lot | null;
    content: ContentMessage[];
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
