import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined;
};

//singleton
export const db = globalThis.prisma || new PrismaClient();

// ensure that we don't create more than one during HMR
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

