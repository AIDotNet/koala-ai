
export interface AuthorizeInput{
    username: string;
    password: string;
    captcha: string | null;
    captchaKey: string | null;
}