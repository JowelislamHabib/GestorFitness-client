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


export const createTrainerApplication = async (applicationData) => {
    const res = await authFetch(`${baseUrl}/trainer-applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
    });
    return res.json();
};

export const getTrainerApplications = async (status = null, userId = null) => {
    let url = `${baseUrl}/trainer-applications`;
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (userId) params.append("userId", userId);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    const res = await authFetch(url);
    return res.json();
};

export const updateTrainerApplicationStatus = async (id, status, feedback = "") => {
    const res = await authFetch(`${baseUrl}/trainer-applications/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, feedback }),
    });
    return res.json();
};
