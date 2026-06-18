'use server'

import { processFetch } from "next/dist/client/components/router-reducer/fetch-server-response";


export const createApplication = async (newFormData)=>{
    return processFetch('/api/applications', newFormData);
}