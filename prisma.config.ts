/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // This tells Prisma CLI where to push the tables
    url: process.env["DIRECT_URL"],
  },
});
