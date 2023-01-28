import { notFoundError, unauthorizedError } from "@/errors";
import { paymentBody } from "@/protocols";
import paymentRepository from "@/repositories/payments-repository";
import ticketRepository, { findTicketWithTypeAndEnrollment } from "@/repositories/tickets-repository";

async function createPaymentService(body: paymentBody, userId: number) {
  if (!body.ticketId || !body.cardData) {
    throw { name: "BadRequestError" };
  }
  
  const { ticketId, cardData } = body;

  const ticket = await findTicketWithTypeAndEnrollment(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  const cardLastDigits = cardData.number.toString().slice(-4);

  const newBody = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits,
  };
  const payment = await paymentRepository.createPayment(newBody);
  await ticketRepository.updateTicketStatus(ticketId);
  return payment;
}

async function getPaymentService(userId: number, ticketId: number) {
  if (!ticketId) {
    throw { name: "BadRequestError" };
  }
  await validateTicket(userId, ticketId);

  return await paymentRepository.findPayment(ticketId);
} 

async function validateTicket(userId: number, ticketId: number) {
  const ticket = await findTicketWithTypeAndEnrollment(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }
  return ticket;
}

const paymentService = { createPaymentService, getPaymentService };

export default paymentService;
