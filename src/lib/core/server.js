import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
  const token = await getUserToken();
  const header = token ? { authorization: `Bearer ${token}` } : {};
  return header;
};

export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  return handleStatus(res);
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  return handleStatus(res);
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...(await authHeader()),
    },
  });

  // handleStatus(res);
  return handleStatus(res);
};

const handleStatus = async (res) => {
  if (res.status === 401) {
    redirect("/unauthorized");
  } 

  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    if (data.message === "Action restricted by Admin") {
      return { message: `Failed: ${data.message}` };
    }
    redirect("/forbidden");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ...data, message: data.message && !data.message.includes("Failed") ? `Failed: ${data.message}` : data.message };
  }

  return res.json();
};
