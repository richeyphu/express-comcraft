import express from "express";

const router = express.Router();

import { Request, Response, NextFunction } from "express";

/* GET users listing. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resource");
});

export default router;
