// src/utils/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Named exports for models you use
export const user = prisma.user;
export const chapter = prisma.chapter;
export const lesson = prisma.lesson;

// Default export for general use
export default prisma;
