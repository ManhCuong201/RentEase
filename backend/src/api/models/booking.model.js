import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema(
    {
        roomId: {
            type: Schema.Types.ObjectId, 
            ref: 'Post',
            required: [true, "Room ID is required"]
        },
        tenantId: {
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: [true, "Tenant ID is required"]
        },
        landlordId: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: [true, "Landlord ID is required"]
        },
        reservationDate: {
            type: Date,
            required: [true, "Reservation date is required"]
        },  
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        isRoomHidden: {
            type: Boolean,
            default: false
        },
        completedDate: {
            type: Date,
            required: false
        },
        isRoomRented: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Booking', BookingSchema, 'Bookings');

export default Booking;