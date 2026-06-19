const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getForumPosts = async (page = 1, limit = 6, authorId = null) => {
    let url = `${baseUrl}/forum-posts?page=${page}&limit=${limit}`;
    if (authorId) {
        url += `&authorId=${encodeURIComponent(authorId)}`;
    }
    const res = await fetch(url);
    return res.json();
};
export const getForumPost = async (id) => {
    const res = await fetch(`${baseUrl}/forum-posts/${id}`);
    return res.json();
};
