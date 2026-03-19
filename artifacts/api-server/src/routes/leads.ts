import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitLeadBody } from "@workspace/api-zod";
import { db, leadsTable } from "@workspace/db";

const router: IRouter = Router();

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

router.post("/leads", async (req: Request, res: Response) => {
  const ip = req.ip ?? "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({ success: false, error: "Too many requests. Please wait before submitting again." });
    return;
  }

  const parseResult = SubmitLeadBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ success: false, error: "Invalid submission. Please check your input." });
    return;
  }

  const { source, name, email, message, inquiryType, route, honeypot } = parseResult.data;

  if (honeypot && honeypot.trim() !== "") {
    res.status(200).json({ success: true, id: "bot", message: "Thank you for your message." });
    return;
  }

  try {
    const [lead] = await db
      .insert(leadsTable)
      .values({
        source,
        name: name ?? null,
        email,
        message: message ?? null,
        inquiryType: inquiryType ?? null,
        route: route ?? null,
      })
      .returning({ id: leadsTable.id });

    res.status(200).json({
      success: true,
      id: String(lead.id),
      message: "Your message has been received. We will be in touch.",
    });
  } catch (err) {
    console.error("Lead submission error:", err);
    res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
  }
});

export default router;
