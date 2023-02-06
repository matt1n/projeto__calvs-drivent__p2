import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import userRepository from "@/repositories/user-repository";
import httpStatus from "http-status";

async function getHotelsService(userId: number) {
  const user = await userRepository.findUserIncludeEnrollmentAndTicket(userId);
  if (user.Enrollment.length === 0 || user.Enrollment[0].Ticket.length===0) {
    throw notFoundError();
  }
  if (user.Enrollment[0].Ticket[0].status==="RESERVED" || user.Enrollment[0].Ticket[0].TicketType.isRemote===true || user.Enrollment[0].Ticket[0].TicketType.includesHotel===false) {
    throw httpStatus[402];
  }

  return await hotelsRepository.findHotels();
}

async function getHotelWithRoomsService(hotelId: number, userId: number) {
  const user = await userRepository.findUserIncludeEnrollmentAndTicket(userId);
  if (user.Enrollment.length === 0 || user.Enrollment[0].Ticket.length===0) {
    throw notFoundError();
  }
  if (user.Enrollment[0].Ticket[0].status==="RESERVED" || user.Enrollment[0].Ticket[0].TicketType.isRemote===true || user.Enrollment[0].Ticket[0].TicketType.includesHotel===false) {
    throw httpStatus[402];
  }
  const hotel = await hotelsRepository.findHotelWithRooms(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  return hotel;
}

const hotelService = { getHotelsService, getHotelWithRoomsService };

export default hotelService;
