
import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Request, Response } from "express";

export async function getTicketTypes(req: Request, res: Response) {
  try {
    const ticketTypes = await ticketsService.getAllTicketTypes();
    res.send(ticketTypes);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const ticket = await ticketsService.getTicket(Number(userId));
    res.send(ticket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(404);
    }
    res.sendStatus(500);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const body = req.body;
  const userId = req.userId;
  const enrollmentId = req.query.enrollmentId;
  try {
    console.log(body, userId, enrollmentId);
    const ticket = await ticketsService.insertTicket(body, Number(userId), Number(enrollmentId));
    res.send(ticket);
  } catch (error) {
    console.log(500);
    res.sendStatus(200);
  }
}
