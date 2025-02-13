import Elysia from "elysia";
import { DeleteUser, GetUser, LoginUser, RegisterUser, UpdateUser } from "./functions/user.function";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { DeletePost, GetAllPosts, UpdatePost, UserPosts } from "./functions/post.function";
import { GetLikes, LikeDisLike } from "./functions/likes.function";
import { get } from "mongoose";
import { DeleteComment, GetAllComments, postComment, UpdatePostComment } from "./functions/comment.function";

const app = new Elysia();

app.get("/", () => "hello Elysia123");



// user register box
app.post("/register", (Cookie) => RegisterUser(Cookie));

app.post("/login", (Cookie) => LoginUser(Cookie));

app.get("/find/user", () => GetUser());

app.put("/update/user/:id", async(c) => {
    return await isAuthenticated(c, () =>UpdateUser(c))
})

app.delete("/delete/user/:id", async(c) => {
    return await isAuthenticated(c, () => DeleteUser(c))
})


// post box
app.post("/upload/post", async(c) => { return await isAuthenticated(c, () => UserPosts(c)) })

app.put("/update/user/post/:id", async(c) => { return await isAuthenticated(c, () => UpdatePost(c) )})

app.delete("/delete/user/post/:id", async(c) => { return await isAuthenticated(c, () => DeletePost(c))})

app.get("/get/user/post", async(c) => { return await isAuthenticated(c, () => GetAllPosts(c))})





//Create likes box
app.post("/give/like", async(c) => { return await isAuthenticated(c, () => LikeDisLike(c))})
app.get("/get/like", async(c) => { return await isAuthenticated(c, () => GetLikes(c))})




// Create comment box
app.post("/comment", async(c) => { return await isAuthenticated(c, () => postComment(c))})
app.put("/update/comment/:id", async(c) => { return await isAuthenticated(c, () => UpdatePostComment(c))})
app.get("/get/comment", async(c) => { return await isAuthenticated(c, () => GetAllComments(c))})
app.delete("/delete/comment/:id", async(c) => { return await isAuthenticated(c, () => DeleteComment(c))})

export default app