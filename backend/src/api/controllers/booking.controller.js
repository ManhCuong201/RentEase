import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import postService from "../services/post.service.js";

const createBooking = async (req, res) => {
  const { roomId, reservationDate } = req.body;
  const tenantId = req.userID
  try {
    const booking = new Booking({
      roomId,
      tenantId,
      landlordId: req.body.landlordId,
      reservationDate,
      status: "Pending",
    });



    await booking.save();

    await postService.changeStatusPost(roomId, req.body.landlordId, "scheduled");

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Error creating booking", error });
  }
};

const getBookingsByTenant = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantId: req.userID })
      .populate("roomId")
      .exec();
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bookings", error });
  }
};

const getLandlordBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ landlordId: req.userID })
      .populate("roomId")
      .exec();
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bookings", error });
  }
};


// Cập nhật trạng thái của booking (Accept, Reject,...)
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating booking status", error });
  }
};

export default {
  createBooking,
  getBookingsByTenant,
  updateBookingStatus,
  getLandlordBookings
};
