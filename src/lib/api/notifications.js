"use server";
import { getTokenServer } from "../getTokenServer";

const authFetch = async (url, options = {}) => {
  const token = await getTokenServer();
  const headers = {
    ...options.headers,
    ...(token ? { authorization: `Bearer ${token}` } : {})
  };
  return fetch(url, { ...options, headers });
};

export const getUserNotifications = async (userId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch notifications");
  }
  return response.json();
};

export const markNotificationAsRead = async (id) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to mark notification as read");
  }
  return response.json();
};

export const markAllNotificationsAsRead = async (userId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/user/${userId}/read-all`, {
    method: 'PATCH'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to mark all as read");
  }
  return response.json();
};
