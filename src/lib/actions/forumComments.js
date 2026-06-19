"use server";

import { serverMutation } from "../core/server";
import { getUserSession } from "../core/session";

export const createForumComment = async (postId, text) => {
    const user = await getUserSession();
    if (!user) throw new Error("You must be logged in to comment.");
    
    const commentData = {
        authorId: user.id,
        author: user.name || "Anonymous",
        authorEmail: user.email,
        authorImage: user.image,
        role: user.role || "Member",
        text,
    };

    return serverMutation(`/forum-posts/${postId}/comments`, commentData);
};

export const updateForumComment = async (id, text) => {
    const user = await getUserSession();
    if (!user) throw new Error("You must be logged in to update a comment.");
    
    const payload = {
        authorId: user.id,
        role: user.role,
        text,
    };

    return serverMutation(`/forum-comments/${id}`, payload, "PATCH");
};

export const deleteForumComment = async (id) => {
    const user = await getUserSession();
    if (!user) throw new Error("You must be logged in to delete a comment.");
    
    const payload = {
        authorId: user.id,
        role: user.role,
    };

    return serverMutation(`/forum-comments/${id}`, payload, "DELETE");
};
