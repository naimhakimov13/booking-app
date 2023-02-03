import { model, Schema } from 'mongoose'
import { CompanyDocument } from '../types/company.interface'

const companySchema = new Schema<CompanyDocument>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    required: true
  },
  preview: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: true
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

export default model<CompanyDocument>('Company', companySchema)
