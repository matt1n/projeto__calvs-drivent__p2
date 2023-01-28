import { AuthenticatedRequest } from "@/middlewares";
import { paymentBody } from "@/protocols";
import paymentService from "@/services/payments-service";
import { Response } from "express";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "http-status";

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const body = req.body as paymentBody;
  const userId = req.userId as number;
  try {
    const payment = await paymentService.createPaymentService(body, userId);
    res.send(payment);
  } catch (error) {
    if(error.name==="NotFoundError") {
      return res.sendStatus(404);
    }
    if(error.name==="UnauthorizedError") {
      return res.sendStatus(401);
    }
    if(error.name==="BadRequestError") {
      return res.sendStatus(400);
    }
    res.sendStatus(500);
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  const ticketId = req.query.ticketId as string;
  try {
    const payment = await paymentService.getPaymentService(userId, Number(ticketId) );
    res.send(payment);
  } catch (error) {
    if(error.name==="NotFoundError") {
      return res.sendStatus(NOT_FOUND);
    }
    if(error.name==="UnauthorizedError") {
      return res.sendStatus(UNAUTHORIZED);
    }
    if(error.name==="BadRequestError") {
      return res.sendStatus(BAD_REQUEST);
    }
    res.sendStatus(500);
  }
}
