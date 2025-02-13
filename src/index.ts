import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";
import app from "./app";

const prisma = new PrismaClient()


app.listen(3030, ()  => {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
} );


