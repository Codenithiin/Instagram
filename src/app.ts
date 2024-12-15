import { Elysia } from "elysia";
import { User } from "./models/user.model";
import {  DeleteUser, GetAllUsers, LoginApi, LogOutApi, SignupApi, UpdateUser } from "./controllers/user.controller";
import { isAuthenticated } from "./middlewares/isAuthenticated";

const app = new Elysia();

app.get("/", () => "Hello Elysia");

app.post("/signup", (c) => SignupApi(c))

app.get("/users", async (c) => {
    return await isAuthenticated(c, () => GetAllUsers(c));
})

app.post("/login", (handlers) => LoginApi(handlers))

app.get("/logout", (c) => LogOutApi(c))

app.put("/update", async(c) => {
    return await isAuthenticated(c, () => UpdateUser(c))
})

app.get("/delete", async(c) => {
    return await isAuthenticated(c, () => DeleteUser(c))
} )

export default app


