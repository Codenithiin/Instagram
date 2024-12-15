import { connectDb } from "../config/db";
import app from "./app";

connectDb()

app.listen(8080, () => {
    "Hello World"
});

console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
  );