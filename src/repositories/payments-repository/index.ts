import { prisma } from "@/config";

async function createPayment(body: {ticketId: number, value: number, cardIssuer: string, cardLastDigits: string}) {
  return await prisma.payment.create({ data: body });
}

async function findPayment(ticketId: number) {
  return await prisma.payment.findFirst({ where: { ticketId } });
}

const paymentRepository = { createPayment, findPayment };

export default paymentRepository;
