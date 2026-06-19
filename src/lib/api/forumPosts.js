const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getForumPosts = async (page = 1, limit = 6) => {
    const res = await fetch(`${baseUrl}/forum-posts?page=${page}&limit=${limit}`);
    return res.json();
};
