import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rileyRouter from "./riley";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rileyRouter);

export default router;
