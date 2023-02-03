import { model, Schema } from 'mongoose'
import { TableDocument } from '../types/table.interface'
import { TableEnum } from '../enums/table.enum'

const tableSchema = new Schema<TableDocument>({
  name: {
    type: String,
    required: true
  },
  seat_count: {
    type: Number,
    required: true
  },
  type: {
    type: Number,
    required: true,
    enum: TableEnum
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
})

export default model<TableDocument>('Table', tableSchema)
