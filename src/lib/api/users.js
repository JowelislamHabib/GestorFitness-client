"use server";
import { headers } from "next/headers";
import { auth } from "../auth";

export const getUsersList = async (query = {}) => {
  // Better-auth listUsers is used by default, but we added a custom pagination endpoint
  // Let's use the custom endpoint if page is provided
  if (query.page) {
    const params = new URLSearchParams(query);
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?${params}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch users");
    }
    return response.json();
  }
  
  const users = await auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });
  return users;
};

const authFetch = async (url, options = {}) => {
  const { getTokenServer } = await import("../getTokenServer");
  const token = await getTokenServer();
  const headers = {
    ...options.headers,
    ...(token ? { authorization: `Bearer ${token}` } : {})
  };
  return fetch(url, { ...options, headers });
};

export const blockUser = async (userId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/block`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to block user");
  }
  return response.json();
};

export const unblockUser = async (userId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/unblock`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to unblock user");
  }
  return response.json();
};

export const toggleTrainerFeature = async (userId, isFeatured) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/feature`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isFeatured })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update featured status");
  }
  return response.json();
};
