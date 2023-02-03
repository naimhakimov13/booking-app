import { Document, Types } from 'mongoose'

export interface Booking {
  table_id: Types.ObjectId,
  date: string,
  time_start: string,
  time_end: string,
  phone: string,
  description: string,
  status: number,
  user_id: Types.ObjectId
}

export interface BookingDocument extends Booking, Document {
}
