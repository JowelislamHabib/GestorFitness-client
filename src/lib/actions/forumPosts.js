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
export const updateForumPost = async (id, postData) => {
    const user = await getUserSession();
    
    const payload = {
        ...postData,
        authorId: user?.id || null,
        role: user?.role || "Member",
    };

    return serverMutation(`/forum-posts/${id}`, payload, "PATCH");
};

export const deleteForumPost = async (id) => {
    const user = await getUserSession();
    
    const payload = {
        authorId: user?.id || null,
        role: user?.role || "Member",
    };

    return serverMutation(`/forum-posts/${id}`, payload, "DELETE");
};
