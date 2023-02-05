import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function findUserIncludeEnrollmentAndTicket(id: number) {
  return await prisma.user.findFirst({ where: { id: id }, include: { Enrollment: { include: { Ticket: { include: { TicketType: true } } } } } });
}

const userRepository = {
  findByEmail,
  create,
  findUserIncludeEnrollmentAndTicket
};

export default userRepository;
