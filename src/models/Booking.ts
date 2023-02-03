import { model, Schema } from 'mongoose'
import { BookingDocument } from '../types/booking.interface'

const booking = new Schema<BookingDocument>({
  date: {
    type: String,
    required: true
  },
  table_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  time_start: {
    type: String,
    required: true
  },
  time_end: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  user_id: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
})

export default model<BookingDocument>('Booking', booking)
