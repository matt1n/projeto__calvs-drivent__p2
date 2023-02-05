import { prisma } from "@/config";

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findHotelWithRooms(hotelId: number) {
  return await prisma.hotel.findUnique({ where: { id: hotelId }, include: { Rooms: true } });
}

const hotelsRepository = { findHotels, findHotelWithRooms };

export default hotelsRepository;
