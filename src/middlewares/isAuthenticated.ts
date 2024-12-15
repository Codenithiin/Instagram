import { Context } from "elysia";
import jwt from "jsonwebtoken"; 
import { User } from "../models/user.model";

interface IUser {
    name: string,
    email: string,
    password?:string,
    _id: string,
    __v: any
}

export interface IContext extends Context {
    user?: IUser;
}

export const isAuthenticated = async (c: Context, nextFunction: (c: Context) => Promise<any>) => {
    const { cookie } = c;
    
    const token = cookie.jwt.value;

    if (!token) {
        c.set.status = 401; 
        return { success: false, message: "Authentication required" };
    }
    
    // Verify the JWT token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || ""); 

        // @ts-ignore
        const user = await User.findOne({_id: decoded?._id || "" });

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
    } catch (err) {
        c.set.status = 401; 
        return { success: false, message: "Invalid or expired token" };
    }
};
