import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import authorizeRoles from '../middlewares/authorizeRoles.js'
import bookingController from '../controllers/booking.controller.js';



const bookingRouter = express.Router();

bookingRouter.post('/create', authenticateJWT, bookingController.createBooking);

bookingRouter.get('/my-bookings', authenticateJWT, bookingController.getBookingsByTenant);

bookingRouter.get('/landlord-bookings', authenticateJWT, bookingController.getLandlordBookings);

// trạng thái đặt lịch Accept, Reject,...
bookingRouter.put('/:id/status', authenticateJWT, bookingController.updateBookingStatus);

export default bookingRouter;