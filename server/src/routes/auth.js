import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../shared.js';

const router = Router();
const registerSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email().max(254), password: z.string().min(8).max(128), language: z.enum(['en','hi','te','gu']).optional(), dashboardMode: z.enum(['simple','advanced']).optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
function tokenFor(user) { return jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d', issuer: 'cardsaathi' }); }
const view = ({ id, name, email, role, language, dashboardMode }) => ({ id, name, email, role, language, dashboardMode });

router.post('/register', async (req, res, next) => { try { const input = registerSchema.parse(req.body); const email = input.email.toLowerCase(); if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ error: 'An account with this email already exists.' }); const { password, ...profile } = input; const passwordHash = await bcrypt.hash(password, 12); const user = await prisma.user.create({ data: { ...profile, email, passwordHash } }); res.status(201).json({ token: tokenFor(user), user: view(user) }); } catch (e) { next(e); } });
router.post('/login', async (req, res, next) => { try { const input = loginSchema.parse(req.body); const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } }); if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' }); res.json({ token: tokenFor(user), user: view(user) }); } catch (e) { next(e); } });
router.post('/forgot-password', async (req, res) => { const parsed = z.object({ email: z.string().email() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Enter a valid email address.' }); res.json({ message: 'If an account exists, password reset instructions will be sent.' }); });
export default router;
