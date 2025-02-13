
import { isContextPassToFunction } from "elysia/dist/sucrose";
import { prisma } from "../config/db";
import { IContext } from "../middlewares/isAuthenticated";


export const LikeDisLike = async ({ body, user }: IContext) => {

    try {
        const { postId }: any = body;

        if (!postId) {
            return {
                success: false,
                message: "Please enter post id"
            }
        }

        const like = await prisma.like.findFirst({
            //@ts-ignore
            where: {
                userId: user?.id,
                postId,
            }
        });

        if(like) {
            const Removelike = await prisma.like.delete({
                where: { id: like.id }
            });
            return {
                success: true,
                message: "Like removed successfully"
            }
        }
            else {
            await prisma.like.create({
                data: {
                    userId: user?.id || "",
                    postId
                }
            });

            return {
                success: true,
                message: "Like added successfully",

            }
        }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went wrong"
        }

    }

}


export const GetLikes = async ({body}: IContext) => {
    try {
        const likes = await prisma.like.findMany();
        return {
            success: true,
            likes
        }
        
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Somthing went wrong"
        }
        
    }
}
