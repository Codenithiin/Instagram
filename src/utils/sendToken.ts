import { Context } from "elysia";

export const sendToken = async({cookie, set}:Context, user:any, message: string, statusCode: number) => {

    const token = await user.generateToken();


    cookie.jwt.set({
        value: token,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: "none",
        httpOnly: true
    })

    set.status = statusCode

    return  {
        success: true,
        message
    }

}