import express from "express";
import prisma from "@repo/db/client";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: " Hello! 27 AUG HTTP Server is running"
  });
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.create({
      data: {
        username,
        password
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});
