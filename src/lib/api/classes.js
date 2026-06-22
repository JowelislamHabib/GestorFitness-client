const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createClass = async (classData) => {
  const res = await fetch(`${baseUrl}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  });
  return res.json();
};

export const getClasses = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.trainerId) queryParams.append("trainerId", filters.trainerId);
  if (filters.page) queryParams.append("page", filters.page);
  if (filters.limit) queryParams.append("limit", filters.limit);
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.category && filters.category !== "All") queryParams.append("category", filters.category);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const res = await fetch(`${baseUrl}/classes${queryString}`);
  return res.json();
};

export const getClassStats = async (trainerId) => {
  const queryParams = new URLSearchParams();
  if (trainerId) queryParams.append("trainerId", trainerId);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const res = await fetch(`${baseUrl}/classes/stats/summary${queryString}`);
  return res.json();
};

export const getClassById = async (id) => {
  const res = await fetch(`${baseUrl}/classes/${id}`);
  return res.json();
};

export const updateClass = async (id, classData) => {
  const res = await fetch(`${baseUrl}/classes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  });
  return res.json();
};

export const updateClassStatus = async (id, status, feedback = "") => {
  const res = await fetch(`${baseUrl}/classes/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, feedback }),
  });
  return res.json();
};

export const deleteClass = async (id) => {
  const res = await fetch(`${baseUrl}/classes/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
