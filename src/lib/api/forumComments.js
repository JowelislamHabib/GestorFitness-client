const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export const getForumComments = async (postId) => {
    const url = `${baseUrl}/forum-posts/${postId}/comments`;
    const res = await fetch(url);
    return res.json();
};
