import { WebSocketServer, WebSocket } from "ws";
import prisma from "@repo/db/client";

const PORT = Number(process.env.WS_PORT) || 4000;

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (socket: WebSocket) => {
  console.log("Client connected");

  let userId: string | null = null;

  socket.send(
    JSON.stringify({
      type: "connection",
      message: "WebSocket connected successfully",
    })
  );

  socket.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Authenticate this WebSocket connection
      if (message.type === "auth") {
        const user = await prisma.user.findUnique({
          where: {
            id: message.userId,
          },
        });

        if (!user) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "User not found",
            })
          );

          return;
        }

        userId = user.id;

        socket.send(
          JSON.stringify({
            type: "authenticated",
            userId: user.id,
          })
        );

        return;
      }

      // Don't allow requests before authentication
      if (!userId) {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Please authenticate first",
          })
        );

        return;
      }

      if (message.type === "getTodos") {
        const todos = await prisma.todo.findMany({
          where: {
            userId,
          },
        });

        socket.send(
          JSON.stringify({
            type: "todos",
            data: todos,
          })
        );
      }

      if (message.type === "createTodo") {
        const todo = await prisma.todo.create({
          data: {
            task: message.task,
            userId,
          },
        });

        socket.send(
          JSON.stringify({
            type: "todoCreated",
            data: todo,
          })
        );
      }
    } catch (error) {
      console.error(error);

      socket.send(
        JSON.stringify({
          type: "error",
          message: "Invalid request",
        })
      );
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);