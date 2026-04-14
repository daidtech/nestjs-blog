require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

global.prisma = prisma;

console.log('[console] Prisma Client loaded as global.prisma');
console.log('Examples:');
console.log('  const users = await prisma.user.findMany();');
console.log('  const newUser = await prisma.user.create({ data: { name: "Alice", email: "alice@example.com" } });');
console.log('  const user = await prisma.user.findUnique({ where: { id: 1 } });');

// Keep the process alive for REPL
process.stdin.resume();
