import { Router } from "express";
import { getPayment, postPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const paymentRouter = Router();

paymentRouter
  .all("/*", authenticateToken)
  .post("/process", postPayment)
  .get("/", getPayment);

export { paymentRouter };
