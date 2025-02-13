import { Context, Cookie } from "elysia";
import jwt from "jsonwebtoken";

export const sendToken = async ({ cookie, set }: Context, user: any, message: string, statusCode: number) => {

    // const token = await user.generateToken();
    const token =  jwt.sign({_id: user.id}, process.env.JWT_SECRET || "");
    console.log("Generated token", token)

    cookie.jwt.set({
        value: token,
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: "none",
        httpOnly: true
    })

    set.status = statusCode

    return {
        seccess: true,
        message
    }
}