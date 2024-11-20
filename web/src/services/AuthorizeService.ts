import { AuthorizeInput } from "@/types/authorize";
import { postJson } from "@/utils/request";

const prefix = '/api/v1/authorization/token';

/**
 * 获取Token
 * @param data 
 * @returns 
 */
export const token = async (data: AuthorizeInput) => {
    return await postJson(prefix, data);
}