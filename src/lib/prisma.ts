import path from "path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.resolve(__dirname, "../../dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export default prisma;
