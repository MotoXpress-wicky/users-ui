import { axiosClient } from "@/shared/api/axiosClient";
import type { ProfileData } from "../types/profile.types";

export const userApi = {
    getProfile: async (): Promise<ProfileData> => {
        // The leading slash matters. Without it the browser would join the path
        // onto the current page path once baseURL is empty.
        const { data } = await axiosClient.get<ProfileData>('/api/v1/user/profile');
        return data;
    },
};
