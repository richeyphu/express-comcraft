import { Request, Response, NextFunction } from 'express';

import { IUser } from '@models';
import { StatusCode } from '@config';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      error: {
        message: 'คุณไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบก่อนใช้งาน',
      },
    });
  }

  const { role } = req.user as IUser;

  if (role === 'admin') {
    next();
  } else {
    return res.status(StatusCode.FORBIDDEN).json({
      error: {
        message: 'คุณไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะผู้ดูแลระบบเท่านั้น',
      },
    });
  }
};

export default isAdmin;
