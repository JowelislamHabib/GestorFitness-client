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
export const getUserBookings = async (userId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/user/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return response.json();
};

export const getAllBookings = async () => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return response.json();
};

export const getTrainerBookings = async (trainerId) => {
  const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/trainer/${trainerId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch trainer bookings");
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
