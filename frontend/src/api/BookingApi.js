import UnauthorApi from "./baseAPI/UnauthorBaseApi";
import AuthorApi from "./baseAPI/AuthorBaseApi";

class BookingAPI {
  constructor() {
    this.url = "/api/booking";
  }

  getMyBookings = async (email) => {
    return AuthorApi.get(`${this.url}/my-bookings`, { params: { email } });
  };

  getLandlordBookings = async (email) => {
    return AuthorApi.get(`${this.url}/landlord-bookings`, { params: { email } });
  };

  updateBookingStatus = async (id, status) => {
    return AuthorApi.put(`${this.url}/${id}/status`, { status });
  };

  createBooking = async (roomId, reservationDate, landlordId) => {
    const data = {
      roomId,
      reservationDate,
      landlordId,
    };
    return AuthorApi.post(`${this.url}/create`, data);
  };
}

export default new BookingAPI();