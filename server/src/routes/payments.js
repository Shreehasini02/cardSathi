import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../shared.js';
const router = Router();
router.get('/', async (req, res, next) => { try { const payments = await prisma.payment.findMany({ where: { userId: req.user.sub }, include: { card: { select: { name: true, last4: true } } }, orderBy: { dueDate: 'desc' } }); res.json({ payments }); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => { try { const input = z.object({ cardId: z.string(), amount: z.coerce.number().positive(), dueDate: z.coerce.date() }).parse(req.body); const card = await prisma.creditCard.findFirst({ where: { id: input.cardId, userId: req.user.sub } }); if (!card) return res.status(404).json({ error: 'Card not found.' }); res.status(201).json({ payment: await prisma.payment.create({ data: { ...input, userId: req.user.sub }, include: { card: true } }) }); } catch (e) { next(e); } });
router.patch('/:id/paid', async (req, res, next) => { try { const result = await prisma.payment.updateMany({ where: { id: req.params.id, userId: req.user.sub }, data: { status: 'PAID', paidAt: new Date() } }); if (!result.count) return res.status(404).json({ error: 'Payment not found.' }); res.json({ payment: await prisma.payment.findUnique({ where: { id: req.params.id }, include: { card: true } }) }); } catch (e) { next(e); } });
export default router;
