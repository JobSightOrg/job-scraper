import fastify from "fastify";
import { apiRoutes, defaultRoutes } from "./route";

const server = fastify();

server.register(defaultRoutes);
server.register(apiRoutes, { prefix: "/api" });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
