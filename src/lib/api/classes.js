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

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const res = await fetch(`${baseUrl}/classes${queryString}`);
  return res.json();
};

export const getClassById = async (id) => {
  const res = await fetch(`${baseUrl}/classes/${id}`);
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
