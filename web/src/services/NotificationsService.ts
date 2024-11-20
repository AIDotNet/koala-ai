import { post } from "@/utils/request";

const prefix = '/api/v1/notifications';

/**
 * 获取登录验证码
 * @param data 
 * @returns 
 */
export const loginCerificationCode = async () => {
    return await post(prefix+"/login-verification-code");
}