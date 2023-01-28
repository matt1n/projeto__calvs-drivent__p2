import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicket, getTicketTypes, postTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTicket)
  .post("/", postTicket);

export { ticketsRouter };
