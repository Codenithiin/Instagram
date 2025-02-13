import { isContextPassToFunction } from "elysia/dist/sucrose";
import { prisma } from "../config/db";
import { IContext } from "../middlewares/isAuthenticated";

export const postComment = async ({ body, user }: IContext) => {
    try {
        const { postId, comment }: any = body;
        if (!postId || !comment) {
            return {
                success: false,
                message: "Please enter postId and comment"
            }
        }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return {
                success: false,
                message: "Post not found"
            }
        }

        await prisma.comment.create({
            data: {
                comment,
                postId,
                userId: user?.id || "",
            },
        });

        return {
            success: true,
            post
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Something went wrong"
        };
    }
}

export const UpdatePostComment = async ({ body, user, params:{id} }: IContext) => {
    try {
        const {  comment }: any = body;

        console.log("Body", body)

        if (!id) {
            return {
                success: false,
                message: "please enter id"
            }
        }
        const findComment = await prisma.comment.findFirst({
            where: { id }
        })
        if (!findComment) {
            return {
                success: false,
                message: "Comment not found"
            }
        }

        await prisma.comment.update({
            where: { id },
            data: {
                comment
            },
        })

        return {
            success: true,
            message: "Comment updated",
            comment
        }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went Wrong"
        }

    }
}

export const GetAllComments = async ({ body, user }: IContext) => {
    try {
        const comments = await prisma.comment.findMany();
        return {
            success: true,
            comments
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went Wrong"
        }

    }
}

export const DeleteComment = async ({ params:{id} }: IContext) => {
    try {
        if (!id) {
            return {
                success: false,
                message: "Please enter id"
            }
        }

        const comment = await prisma.comment.delete({
            where: { id }
        });

        return {
            success: true,
            message: "Comment deleted",
        }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went Wrong"
        }

    }
}   