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
export const getUserBookings = async (userId, query = {}) => {
  const params = new URLSearchParams(query);
  const queryString = params.toString() ? `?${params}` : '';
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/user/${userId}${queryString}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return response.json();
};

export const getAllBookings = async (query = {}) => {
  const params = new URLSearchParams(query);
  const queryString = params.toString() ? `?${params}` : '';
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings${queryString}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return response.json();
};

export const getTrainerBookings = async (trainerId, query = {}) => {
  const params = new URLSearchParams(query);
  const queryString = params.toString() ? `?${params}` : '';
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/trainer/${trainerId}${queryString}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch trainer bookings");
  }
  return response.json();
};

export const getTrainerAndUserBookings = async (id, query = {}) => {
  const params = new URLSearchParams(query);
  const queryString = params.toString() ? `?${params}` : '';
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/trainer-and-user/${id}${queryString}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch combined bookings");
  }
  return response.json();
};

export const getClassAttendees = async (classId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/class/${classId}/attendees`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch class attendees");
  }
  return response.json();
};
