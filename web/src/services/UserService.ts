import { get } from "@/utils/request";


const prefix = '/api/v1/users';

export const currentUserInfo = async () => {
    return await get(`${prefix}/current`);
}