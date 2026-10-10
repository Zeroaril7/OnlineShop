import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayloadUser {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayloadUser;
}

export const JWT_SECRET = process.env.JWT_SECRET || 'online_shop_jwt_secret_key_2026';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Akses ditolak: Token autentikasi tidak ditemukan' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token tidak valid atau telah kedaluwarsa' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Akses ditolak: Operasi ini hanya diperbolehkan untuk Administrator' });
    return;
  }
  next();
};
