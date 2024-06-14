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
  try {
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
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

// login rout
app.post("/users/Login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send({
        success: false,
        error: "you have to provide username and password",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.send({
        success: false,
        error: "invalid username or password",
      });
    }
    // password matches
    const isUserValid = await bcrypt.compare(password, user.password);
    if (!isUserValid) {
      return res.send({
        success: false,
        message: "invalid username or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      token,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/users/token", async (req, res) => {
  const token = await req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  delete user.password;

  res.send({
    success: true,
    user,
  });
});

app.use((req, res) => {
  res.send({
    success: false,
    error: "no route found",
  });
});

app.listen(port, () => {
  console.log("app listening on port 3000");
});
