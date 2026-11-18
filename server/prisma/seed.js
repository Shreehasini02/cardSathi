import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const categories = ['Shopping', 'Food', 'Travel', 'Entertainment', 'Education', 'Healthcare', 'Bills', 'Others'];
try { for (const name of categories) await prisma.category.upsert({ where: { name }, update: {}, create: { name } }); }
finally { await prisma.$disconnect(); }
