import { Request, Response, NextFunction } from 'express';

import { StatusCode } from '@config';

const index = (req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCode.I_AM_A_TEAPOT).json({
    message:
      // eslint-disable-next-line max-len
      '♫ Never gonna give you up ♪ Never gonna let you down ♫ Never gonna run around and desert you ♪ Never gonna make you cry ♫ Never gonna say goodbye ♪ Never gonna tell a lie and hurt you ♫',
  });
};

export { index };
