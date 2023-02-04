import { Request, Response, NextFunction } from 'express';
import { IUser } from '@models';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.user as IUser;

  if (role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      error: {
        message: 'คุณไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะผู้ดูแลระบบเท่านั้น',
      },
    });
  }
};

export default isAdmin;
