// =========================
// Modded server stay silent
// =========================

// Detect SHUT-UP mode from CLI

const SHUT_UP = process.argv.includes("--quiet");

// Silence all console output

if (SHUT_UP) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {}; // remove this line if you want runtime errors visible
}

// ======================
// Import everything else
// ======================

import "dotenv/config";
import net from "net";
import tls from "tls";
import { promises as fs } from "fs";
import { Client } from "./Client";
import { UserService } from "./services/UserService";
import { CMSService } from "./services/CMSService";
import { GameService } from "./services/GameService";
import { NotificationService } from "./services/NotificationService";
import { PaymentService } from "./services/PaymentService";
import { ReadOnlyGameService } from "./services/ReadOnlyGameService";
import { PingService } from "./services/PingService";
import { BaseService } from "./services/BaseService";
import { AnalyticsProxyService } from "./services/AnalyticsProxyService";
import Settings from "./Settings";
import { HttpServer } from "./HttpServer";
import Logger from "./lib/Logger";
import { ClientServerMessageHeaderMap } from "@externaladdress4401/protobuf/protos/ClientServerMessageHeader";

// ===============================
// Initialise our server as usual
// ===============================

Settings.init();

let clientIndex = 0;
let serverIndex = 0;

const expressServer = new HttpServer();

const services = new Map<string, BaseService>();
const servicesToRegister = [
  new UserService(),
  new CMSService(),
  new GameService(),
  new NotificationService(),
  new PaymentService(),
  new ReadOnlyGameService(),
  new PingService(),
  new AnalyticsProxyService(),
];

for (const service of servicesToRegister) {
  services.set(service.name, service);
}

const clients = new Map<net.Socket, Client>();

const saClient = tls.connect(
  {
    host: "socket-gateway.prod.robin.newbirds.net",
    port: 443,
  },
  () => {
    if (!SHUT_UP) console.log("Connected remote TLS server"); // if not quiet, show when server starts
  }
);

saClient.on("error", (err) => {
  if (!SHUT_UP) console.error("TLS client error"); // if cannot connect to server, then show error
});

let globalSocket: net.Socket | null;

saClient.on("data", async (data) => {
  if (!globalSocket) return;

  const client = clients.get(globalSocket);
  if (!client) return;

  client.write(data);
  client.handlePacket(data);

  const packets = client.extractPackets();
  for (const packet of packets) {
    await fs.writeFile(`./packets/server/${serverIndex++}`, data);
    globalSocket.write(packet.buffer);
    client.reset();
  }
});

net
  .createServer((socket) => {
    globalSocket = socket;
    clients.set(socket, new Client(socket));

    socket.on("data", async (data) => {
      const client = clients.get(socket!);
      if (!client) return;

      client.handlePacket(data);

      const packets = client.extractPackets();
      for (const packet of packets) {
        const header = packet.parseHeader(ClientServerMessageHeaderMap);

        if (!client.clide) client.setClide(header.clide);

        if (!Settings.USE_PRIVATE_SERVER) {
          if (header.compressed) await packet.payload.decompress();
          await fs.writeFile(`./packets/client/${clientIndex++}`, data);
          saClient.write(data);
          client.reset();
          return;
        }

        const service = services.get(header.service);
        if (!service) {
          if (!SHUT_UP) Logger.warn(`${header.service} is an unknown service.`); // if unknown service, then show error
          continue;
        }

        if (!SHUT_UP) Logger.info(
          `${service.name} received a packet.`, // if not quiet mode, show info
          client.clide ?? undefined
        );

        await service.handlePacket(packet, client);
      }

      client.reset();
    });

    socket.on("end", () => {
      const client = clients.get(socket);
      clients.delete(socket);
      if (!SHUT_UP) Logger.info("Client disconnected.", client?.clide); // if not quiet, show when app closes
      globalSocket = null;
    });

    socket.on("error", (err) => {
      const client = clients.get(socket);
      clients.delete(socket);
      if (!SHUT_UP) Logger.error(err.message, client?.clide); // if not quietm show other errors
    });
  })
  .listen(Settings.SERVER_PORT, "0.0.0.0");
