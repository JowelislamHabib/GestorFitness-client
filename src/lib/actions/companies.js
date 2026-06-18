"use server";

import { serverMutation } from "../core/server";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// export const createCompany = async (newJobData) => {
//     const res = await fetch(`${baseUrl}/api/companies`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newJobData),
//     });

//     return res.json();
// };

export const createCompany = async (newFormData) => {
  return serverMutation("/api/companies", newFormData);
};

export const updateCompany = async (id, newFormData) => {
  return serverMutation(`/api/companies/${id}`, newFormData, "PATCH");
};
