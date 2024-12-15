import Elysia, { Context, t } from "elysia";
import { User } from "../models/user.model";
const SecretKay = "secretKey";
import bcrypt from "bcrypt"
import { sendToken } from "../utils/sendToken";
import { IContext } from "../middlewares/isAuthenticated";

export const GetAllUsers = async ({ set }: Context) => {
    try {
        const users = await User.find();

        return {
            success: true,
            users
        };
    } catch (error) {
        console.log(error);
        set.status = 500;
        return {
            success: false,
            message: "Something went wrong"
        };
    }
};


export const LoginApi = async ({ body, set, response, cookie }: Context) => {
    try {
        const { email, password }: any = body;

        if (!email || !password) {
            set.status = 500;
            return {
                success: false,
                massage: "please enter all fields"
            }
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            set.status = 401;
            return {
                succsss: false,
                massage: "Incorrect Email or Password "
            }
        }


        const isMatch = await bcrypt.compare(password, user?.password || "")

        if (!isMatch) {
            set.status = 401;
            return {
                success: false,
                massage: "incorrect password"
            }
        }

        set.status = 200;

        // @ts-ignore
        const response = sendToken({ cookie, set }, user, "Logged in successfully", 200);
        return response
    } catch (error) {
        console.log(error);
        return {
            success: false,
            massage: "somthing went wrong",
        }

    }
    // jwt.sign(User),SecretKay
}

export const SignupApi = async ({ body, set, cookie }: Context) => {
    try {
        const { name, email, password }: any = body;
        let user = await User.findOne({ email })
        if (user) {
            set.status = 409
            return {
                success: false,
                message: "users is already exists"
            }
        }
        set.status = 201;
        user = await User.create({ name, email, password })

        // @ts-ignore
        const response = await sendToken({ cookie, set }, user, "Signup successfully", 201)
        return response
    } catch (error: any) {
        set.status = 500;
        return {
            success: false,
            message: error?.message || "Something went wrong",

        }
    }

}
export const LogOutApi = async ({ set, cookie }: Context) => {
    try {
        cookie.jwt.set({
            value: "",
            expires: new Date(Date.now()),
            secure: true,
            sameSite: "none",
            httpOnly: true
        })
        return {
            succes: true,
            message: "Logged out successfully"
        }

    } catch (error: any) {
        set.status = 500;
        return {
            success: false,
            message: error?.massage || "somthing went wrong",
        }
    }
}

export const UpdateUser = async ({ body, set, cookie, user }: IContext) => {
    try {

        const userInputs: any = body;


        if (Object.keys(userInputs).length === 0) {
            set.status = 400;
            return {
                success: false,
                message: "Please enter at least one field"
            }
        };



        const updatedUser = await User.findOneAndUpdate({_id: user?._id}, userInputs);


        return {
            success: true,
            message: "User updated successfully",
            user: updatedUser
        }



    } catch (error) {
        return {
            success: false,
            massage: "sothing went wrong"
        }
    }
}


export const DeleteUser = async({user}: IContext) => {
    try {
        await User.findOneAndDelete({_id: user?._id });
        return {
            success: true,
            message: "User deleted successfully"
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}