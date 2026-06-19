"use server";

import { serverMutation } from "../core/server";
import { getUserSession } from "../core/session";

export const createForumPost = async (postData) => {
    const user = await getUserSession();
    
    const enrichedPostData = {
        ...postData,
        authorId: user?.id || null,
        author: user?.name || "Anonymous",
        authorEmail: user?.email || null,
        authorImage: user?.image || null,
        role: user?.role || "Member",
    };

    return serverMutation('/forum-posts', enrichedPostData);
};
