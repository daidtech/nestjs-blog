require('dotenv').config();

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : new Pool();
const prisma = new PrismaClient({
	adapter: new PrismaPg(pool),
});

global.prisma = prisma;

console.log('[console] Prisma Client loaded as global.prisma');
console.log('Examples:');
console.log('  const users = await prisma.user.findMany();');
console.log('  const newUser = await prisma.user.create({ data: { name: "Alice", email: "alice@example.com" } });');
console.log('  const user = await prisma.user.findUnique({ where: { id: 1 } });');

// Keep the process alive for REPL
process.stdin.resume();
