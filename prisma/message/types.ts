import { ContentMessage } from "../content-message/types";
import { Lot } from "../lot/types";
import { Post } from "../post/types";
import { User } from "../user/types";

export type Message = {
    id: string;
    userId: string;
    user: User;
    lotId: string | null;
    lot: Lot | null;
    postId: string | null;
    post: Post | null;
    content: ContentMessage[];
    isArchived: boolean;
    isReadByUser: boolean;
    isReadByAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
