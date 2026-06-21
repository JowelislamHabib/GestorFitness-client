export const getUserBookings = async (userId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/user/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return response.json();
};

export const getAllBookings = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return response.json();
};

export const getTrainerBookings = async (trainerId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/trainer/${trainerId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch trainer bookings");
  }
  return response.json();
};
