"use server";
import { getTokenServer } from "../getTokenServer";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const authFetch = async (url, options = {}) => {
  const token = await getTokenServer();
  const headers = {
    ...options.headers,
    ...(token ? { authorization: `Bearer ${token}` } : {})
  };
  return fetch(url, { ...options, headers });
};


export const getForumPosts = async (page = 1, limit = 6, authorId = null, search = "", sort = "newest", role = "", category = "") => {
    let url = `${baseUrl}/forum-posts?page=${page}&limit=${limit}`;
    if (authorId) {
        url += `&authorId=${encodeURIComponent(authorId)}`;
    }
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    if (sort) {
        url += `&sort=${encodeURIComponent(sort)}`;
    }
    if (category && category !== "all") {
        url += `&category=${encodeURIComponent(category)}`;
    }
    if (role && role !== "all") {
        let roleValue = role;
        if (role === "members") roleValue = "member";
        if (role === "trainers") roleValue = "trainer";
        if (role === "admins") roleValue = "admin";
        url += `&role=${encodeURIComponent(roleValue)}`;
    }
    const res = await fetch(url);
    return res.json();
};
export const getForumPost = async (id) => {
    const res = await fetch(`${baseUrl}/forum-posts/${id}`);
    return res.json();
};
