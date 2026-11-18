import { Router } from 'express';
import { prisma } from '../shared.js';
const router = Router();
router.get('/overview', async (_req, res, next) => { try { const since = new Date(Date.now() - 30 * 86400000); const [users, activeUsers, transactions, issues] = await Promise.all([prisma.user.count(), prisma.user.count({ where: { updatedAt: { gte: since } } }), prisma.transaction.count({ where: { createdAt: { gte: since } } }), prisma.notification.count({ where: { type: 'SYSTEM' } })]); res.json({ users, activeUsers, transactionsProcessed: transactions, reportedIssues: issues }); } catch (e) { next(e); } });
router.get('/users', async (_req, res, next) => { try { const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { cards: true, transactions: true } } }, orderBy: { createdAt: 'desc' }, take: 100 }); res.json({ users }); } catch (e) { next(e); } });
export default router;
