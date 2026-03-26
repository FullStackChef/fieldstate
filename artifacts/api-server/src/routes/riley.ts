import { Router, type IRouter } from "express";
import { runRiley } from "../services/riley";

const router: IRouter = Router();

router.post("/riley", async (req, res) => {
  try {
    const response = await runRiley(req.body);
    res.json(response);
  } catch (error) {
    console.error("Riley route error:", error);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid Riley request.",
    });
  }
});

export default router;
