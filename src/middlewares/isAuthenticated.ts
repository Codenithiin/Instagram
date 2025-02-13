import Elysia, { Context, Cookie } from "elysia";
//import { User } from "@prisma/client";
import Jwt from "jsonwebtoken";
import { prisma } from "../config/db";

interface IUser {
    name: string,
    email: string,
    password?: string,
    id: string,
    __v: any
}



export interface IContext extends Context {
    user?: IUser;
}

export const isAuthenticated = async (c: Context, nextFunction: (c: Context) => Promise<any>) => {
    const {cookie} = c;

 const token = cookie.jwt.value;

 console.log(token)
 
        if(!token){
            c.set.status = 401;
            return { success: false, message: "Authentication required"};
        }


    const decoded = Jwt.verify(token, process.env.JWT_SECRET || "");
    console.log("Decoded", decoded)
    //@ts-ignore
    const id = decoded?._id || "";

      // @ts-ignore
    const user = await prisma.user.findUnique({where: {
        id: id 
    }});

    console.log("User", user)

    if(!user){
        c.set.status = 404;
        return {
            success: false,
            message: "User not found!"
        }
    }
      // @ts-ignore
   c.user = user;

   return nextFunction(c); 

}