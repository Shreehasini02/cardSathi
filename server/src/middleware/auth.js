import jwt from 'jsonwebtoken';
export function auth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Your session has expired. Please sign in again.' }); }
}
export const adminOnly = (req, res, next) => req.user?.role === 'ADMIN' ? next() : res.status(403).json({ error: 'Administrator access required.' });
