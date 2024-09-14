import express from "express";
import fs from "fs";
import path from "path";

export default function registerRoutes(server: express.Express) {
  const routesPath = path.join(__dirname, "../routes");
  const routeFiles = fs.readdirSync(routesPath);

  routeFiles.forEach((file) => {
    if (file.endsWith("router.ts")) {
      const routeModule = require(path.join(routesPath, file));
      if (routeModule.default) {
        server.use(routeModule.default);
      }
    }
  });
}
