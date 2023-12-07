import { NextApiRequest, NextApiResponse } from "next";
import { Socket as NetSocket } from "net";
import { Server as WebServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ServerIoApiResponse = NextApiResponse & {
  socket: NetSocket & {
    server: WebServer & {
      io: SocketIOServer;
    }
  }
}

// handler for websocket traffic
const ioHandler = (req: NextApiRequest, res: ServerIoApiResponse) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: WebServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;
