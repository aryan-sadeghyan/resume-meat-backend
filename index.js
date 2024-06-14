import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "welcome to resume meat backend.",
  });
});

app.get("/summaries", async (req, res) => {
  const summaries = await prisma.summary.findMany();
  res.send({
    success: true,
    summaries,
  });
});

app.post("/users/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (checkUser) {
    return res.send({
      success: false,
      error: "a username has already been taken",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.send({
    success: true,
    token,
  });
});

// /users/token to ger back users info

// app.get("/users/token", (req, res) => {
//  res.send({
//     success: true,
//   });
// });

app.use((req, res) => {
  res.send({
    success: false,
    error: "no route found",
  });
});

app.listen(port, () => {
  console.log("app listening on port 3000");
});
