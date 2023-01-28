import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { createTicket, findTicket, findTicketTypes } from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

async function  getAllTicketTypes() {
  return await findTicketTypes();
}

async function getTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await findTicket(enrollment);

  if(!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function insertTicket(body: { ticketTypeId: number }, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  if (!body.ticketTypeId) {
    throw { name: "BadRequest" };
  }
  const newBody = { ...body, status: "RESERVED", enrollmentId: enrollment.id } as {status: TicketStatus, ticketTypeId: number, enrollmentId: number};
  return await createTicket(newBody);
}

const ticketsService = { getAllTicketTypes, getTicket, insertTicket };

export default ticketsService;
