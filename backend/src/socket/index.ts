import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import { query } from "../config/db.js";
import { setIo, boardRoom } from "../realtime/index.js";

export async function userCanAccessBoard(userId: string, boardId: string) {
  const { rows } = await query(
    `
        SELECT 1 FROM boards b
            LEFT JOIN board_members m ON m.board_id = b.id AND m.user_id = $2
        WHERE b.id = $1 AND (b.owner_id = $2 OR m.user_id = $2)
        `,
    [boardId, userId],
  );

  return rows.length > 0;
}

export function initSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.use((socket, next) => {
    try {
      const token = socket.handshake.headers.cookie;
      if (!token) return next(new Error("Authentication required"));
      const decoded = verifyToken(token);
      socket.data.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { user } = socket.data.user;
    socket.on("board:join", async (boardId, ack) => {
      try {
        if (!(await userCanAccessBoard(user.id, boardId))) {
          if (ack) ack({ ok: false, error: "No access to this board" });
          return;
        }
        const room = boardRoom(boardId);
        socket.join(room);

        socket.to(room).emit("presemce:join", {
          user: { id: user.id, name: user.name },
          boardId,
        });

        const sockets = await io.in(room).fetchSockets();
        const seen = new Set([user.id]);
        const viewers = [];

        for (const s of sockets) {
          const u = s.data?.user;
          if (!u || seen.has(u.id)) continue;
          seen.add(u.id);
          viewers.push({ id: u.id, name: u.name });
        }
        socket.emit("presence:sync", { boardId, users: viewers });

        if (ack) ack({ ok: true });
      } catch (error) {
        if (ack) ack({ ok: false, error: "Failed to join board" });
      }
    });
    socket.on("board:leave", (boardId) => {
      socket.leave(boardRoom(boardId));
      socket.to(boardRoom(boardId)).emit("presence:leave", {
        user: { id: user.id, name: user.name },
        boardId,
      });
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room === socket.id) continue;
        socket.to(room).emit("presence:leave", {
          user: { id: user.id, name: user.name },
        });
      }
    });
  });
  setIo(io);
  return io;
}
