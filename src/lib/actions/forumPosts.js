"use server";

import { serverMutation } from "../core/server";

export const createForumPost = async (postData) => {
    return serverMutation('/forum-posts', postData);
};
