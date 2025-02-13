import { Context, form } from "elysia"
import { prisma } from "../config/db";
import { PrismaClient } from "@prisma/client";
import { sendToken } from "../utils/sendToken";
import { IContext } from "../middlewares/isAuthenticated";



export const RegisterUser = async ({ body, set }: Context) => {
    try {

        const { name, email, password }: any = body;

        let user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (user) {
            set.status = 400;
            return {
                success: false,
                message: "Email exists already"
            }
        }
        user = await prisma.user.create({
            data: { name, email, password }
        });

        set.status = 201;
        return {
            success: true,
            message: "Registertion successfully",
            user
        }

    } catch (error) {
        console.log(error)
        set.status = 500;
        return {
            success: false,
            message: "Somthing went wrong"
        }

    }
}



export const LoginUser = async ({ body, cookie, set }: Context) => {
    try {
        const { email, password }: any = body;
        let user = await prisma.user.findFirst({
            where: { email: email, password: password }
        })
        if (!user) {
            return {
                success: false,
                message: "Email or Password Wrong!"
            }
        }
        // @ts-ignore
        return sendToken({ cookie, set }, user, "Logged in successfully", 200)
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Somthing went wrong"
        }
    }
}

export const GetUser = async () => {
    try {
        let user = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                posts: true,
                likes: true,
                comments: true
            }
        });
        console.log(user)


        if (user.length === 0) {
            return {
                success: false,
                message: "No users found",
            };
        }

        return {
            success: true,
            message: "Get user successfully",
            user
        }


    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went wrong"
        }

    }
}

export const UpdateUser = async (ctx: Context) => {
    try {
        const { id }: any = ctx.params;
        if (!id) {
            return {
                success: false,
                message: "Please enter id"
            }
        }
        const { name, email }: any = ctx.body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                name, email
            }
        });
        return {
            success: true,
            user
        }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went wrong"
        }

    }
}

export const DeleteUser = async (ctx: Context) => {
    try {
        const { id }: any = ctx.params;

        if (!id) {
            return {
                success: false,
                message: "User id not found",
            }
        }

        const user = await prisma.user.delete({
            where: { id },
        });

        return {
            success: true,
            message: "User deleted successfully",
        }


    } catch (error) {
        console.error(error)

        return {
            success: false,
            message: "Somthing went wrong"
        }

    }
}