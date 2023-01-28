import { prisma } from "@/config";
import { Address, Enrollment, TicketStatus } from "@prisma/client";

export async function findTicketTypes() {
  return await prisma.ticketType.findMany();
}

export async function findTicket(enrollment: Enrollment & {
    Address: Address[];}) {
  return await prisma.ticket.findFirst({ where: { enrollmentId: enrollment.id }, include: { TicketType: true } });
}

export async function createTicket(body: {status: TicketStatus, ticketTypeId: number, enrollmentId: number}) {
  return await prisma.ticket.create({ data: body, include: { TicketType: true } });
}

export async function findTicketWithTypeAndEnrollment(id: number) {
  return await prisma.ticket.findUnique({ where: { id }, include: { TicketType: true, Enrollment: true } });
}

export async function updateTicketStatus(ticketId: number) {
  return await prisma.ticket.update({ where: { id: ticketId }, data: { status: "PAID" } });
}

const ticketRepository = {
  findTicketTypes,
  findTicket,
  createTicket,
  findTicketWithTypeAndEnrollment,
  updateTicketStatus
};

export default ticketRepository;
