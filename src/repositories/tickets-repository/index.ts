import { prisma } from "@/config";
import { Address, Enrollment, TicketStatus } from "@prisma/client";

export async function findTicketTypes() {
  return await prisma.ticketType.findMany();
}

export async function findTicket(enrollment: Enrollment & {
    Address: Address[];}) {
  return await prisma.ticket.findFirst({ where: { enrollmentId: enrollment.id } });
}

export async function createTicket(body: {status: TicketStatus, ticketTypeId: number, enrollmentId: number}) {
  return await prisma.ticket.create({ data: body, include: { TicketType: true } });
}

const ticketRepository = {
  findTicketTypes,
  findTicket,
  createTicket
};

export default ticketRepository;
