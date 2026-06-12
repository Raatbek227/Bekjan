export function registerSockets(io) {
  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });
}
