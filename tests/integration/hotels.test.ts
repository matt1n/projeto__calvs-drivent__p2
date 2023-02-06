import app, { init } from "@/app";
import { createEnrollmentWithAddress, createUser, createTicketTypeHotel, createTicket, createTicketTypeNoHotel, createTicketTypeRemote } from "../factories";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEvent } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { prisma } from "@/config";

beforeAll(async () => {
  await init();
  await cleanDb();
  await createEvent();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser({ email: "sim@gmail.com", password: "simsim" });
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("when token is valid", () => {
    it("should respond with status 404 if given user not have a enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    describe("when user have enrollment", () => {
      it("should respond with status 404 if given user not have a ticket", async () => {
        const user = await createUser();
        await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
      describe("when user have ticket", () => {
        it("should respond with status 402 if given user ticket is not paid", async () => {
          const ticketType = await createTicketTypeHotel();
          const user = await createUser();
          const enrollment = await createEnrollmentWithAddress(user);
          const token = await generateValidToken(user);
      
          await createTicket(enrollment.id, ticketType.id, "RESERVED");
      
          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
        
        it("should respond with status 402 if given user ticket not includes hotel", async () => {
          const ticketType = await createTicketTypeNoHotel();
          const user = await createUser();
          const enrollment = await createEnrollmentWithAddress(user);
          const token = await generateValidToken(user);
      
          await createTicket(enrollment.id, ticketType.id, "PAID");
      
          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
        
        it("should respond with status 402 if given user ticket is remote", async () => {
          const ticketType = await createTicketTypeRemote();
          const user = await createUser();
          const enrollment = await createEnrollmentWithAddress(user);
          const token = await generateValidToken(user);
      
          await createTicket(enrollment.id, ticketType.id, "PAID");
      
          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
        describe("when ticket is paid and includes hotel", () => {
          it ("Should respond with 200 and hotels data", async () => {
            await prisma.hotel.create({ data: { name: "aaaaaaaa", image: "bbbb" } });
            const ticketType = await createTicketTypeHotel();
            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
        
            await createTicket(enrollment.id, ticketType.id, "PAID");
        
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String)
              })
            ]));
          });
        });
      });
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/2");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser({ email: "sima@gmail.com", password: "simsim" });
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("when token is valid", () => {
    it("should respond with status 404 if given user not have a enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    describe("when user have enrollment", () => {
      it("should respond with status 404 if given user not have a ticket", async () => {
        const user = await createUser();
        await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
    
        const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
    
      describe("when user have ticket", () => {
        it("should respond with status 402 if given user ticket is not paid", async () => {
          const ticketType = await createTicketTypeHotel();
          const user = await createUser();
          const enrollment = await createEnrollmentWithAddress(user);
          const token = await generateValidToken(user);
      
          await createTicket(enrollment.id, ticketType.id, "RESERVED");
      
          const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);
      
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
        
        it("should respond with status 402 if given user ticket not includes hotel", async () => {
          const ticketType = await createTicketTypeNoHotel();
          const user = await createUser();
          const enrollment = await createEnrollmentWithAddress(user);
          const token = await generateValidToken(user);
      
          await createTicket(enrollment.id, ticketType.id, "PAID");
      
          const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);
      
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
        
        it("should respond with status 402 if given user ticket is remote", async () => {
          const ticketType = await createTicketTypeRemote();
          const user = await createUser();
          const enrollment = await createEnrollmentWithAddress(user);
          const token = await generateValidToken(user);
      
          await createTicket(enrollment.id, ticketType.id, "PAID");
      
          const response = await server.get("/hotels/2").set("Authorization", `Bearer ${token}`);
      
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
        describe("when ticket is paid and includes hotel", () => {
          it ("Should respond with 404 when hotelId is not valid", async () => {
            const ticketType = await createTicketTypeHotel();
            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
        
            await createTicket(enrollment.id, ticketType.id, "PAID");
        
            const response = await server.get("/hotels/-1").set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.NOT_FOUND);
          });
        
          describe("when hotelId is valid", () => {
            it ("Should respond with 200 and hotels", async () => {
              const hotel = await prisma.hotel.create({ data: { name: "aaaaaaaa", image: "bbbb" } });
              const ticketType = await createTicketTypeHotel();
              const user = await createUser();
              const enrollment = await createEnrollmentWithAddress(user);
              const token = await generateValidToken(user);
          
              await createTicket(enrollment.id, ticketType.id, "PAID");
          
              const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
          
              expect(response.status).toBe(httpStatus.OK);
              expect(response.body).toEqual(
                expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String),
                  image: expect.any(String),
                  Rooms: [] || expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(Number),
                      name: expect.any(String),
                      capacity: expect.any(Number),
                      hotelId: expect.any(Number),
                    })
                  ])
                })
              );
            });
          });
        });
      });
    });
  });
});
