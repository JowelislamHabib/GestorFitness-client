import { serverFetch } from "../core/server";

export const getForumPosts = async (page = 1, limit = 6) => {
    return serverFetch(`/forum-posts?page=${page}&limit=${limit}`);
};
