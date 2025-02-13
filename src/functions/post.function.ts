import Elysia from "elysia";
import Context from "elysia"
import { prisma } from "../config/db";
import { PrismaClient } from "@prisma/client";
import { IContext } from "../middlewares/isAuthenticated";
import { model } from "mongoose";


export const UserPosts = async ({ body, user }: IContext) => {
    try {
        const { title, description }: any = body;


        const post = await prisma.post.create({
            data: {
                title,
                description,
                userId: user?.id || "",
            },
        });

        return {
            success: true,
            post,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Something went wrong"
        };
    }
};


export const UpdatePost = async ({ body, params:{id} }: IContext) => {
    try {
        if (!id) {
            return {
                success: false,
                message: "Please enter id"
            }
        }

        const findPost = await prisma.post.findFirst({
            where: { id }
        })
        if(!findPost){
            return {
                success: false,
                message: "Post not found"
            }
        }

        const { title, description }: any = body;
        if(!title || !description){
            return {
                success: false,
                message: "Please enter title and description"
            }
        }
        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                description
            },
        });
         return {
            success: true,
            post
         }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went Wrong"
        }

    }
}


export const DeletePost = async ({ params:{id} }: IContext) => {
    try {
        if (!id) {
            return {
                success: false,
                message: "Post id not found",
            }
        }

        const post = await prisma.post.delete({
            where: { id },
        });
        return {
            success: true,
            message: "Post deleted",
        };
        
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went Wrong"
        
    }
    }
}


export const GetAllPosts = async ({ body, user }: IContext) => {
    try {
        const posts = await prisma.post.findMany();

        return {
            success: true,
            posts
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went Wrong"
        }
        
    }
}

