import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenServer = async () => {
  try {
    const response = await auth.api.getToken({
      headers: await headers(),
    });
    // console.log("getToken response:", response);
    return response?.token || null;
  } catch (error) {
    // console.error("getTokenServer error:", error);
    return null;
  }
};
