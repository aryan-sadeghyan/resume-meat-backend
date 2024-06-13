import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

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

app.use((error, req, res, next) => {
  res.send({
    success: false,
    message: error.message,
  });
});

app.listen(port, () => {
  console.log("app listening on port 3000");
});
