import { protectedFetch, serverFetch } from "../core/server";
import { getUserSession } from "../core/session";

export const getRecruiterCompany = async (recruiterId) => {
  return serverFetch(`/api/my/companies?recruiterId=${recruiterId}`);
};

export const getCompanies = async () => {
  return protectedFetch(`/api/companies`);
};

export const getLoggedRecruiterCompany = async () => {
  const user = await getUserSession();
  // console.log(user);
  return getRecruiterCompany(user?.id);
};
