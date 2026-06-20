export const getUserFavorites = async (userId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorite-classes/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch favorites");
  }
  return response.json();
};

export const addFavorite = async (userId, classId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorite-classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, classId }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to add favorite");
  }
  return response.json();
};

export const removeFavorite = async (userId, classId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorite-classes?userId=${userId}&classId=${classId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to remove favorite");
  }
  return response.json();
};
