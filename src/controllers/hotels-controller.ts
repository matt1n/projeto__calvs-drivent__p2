import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const hotels = await hotelService.getHotelsService(userId); 
    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error === "Payment Required") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    res.sendStatus(500);
  }
}

export async function getHotelsWithRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = req.params.hotelId;
  const userId = req.userId;
  try {
    const hotel = await hotelService.getHotelWithRoomsService(Number(hotelId), userId);
    res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error === "Payment Required") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    res.sendStatus(500);
  }
}
