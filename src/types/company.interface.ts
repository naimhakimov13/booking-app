import { Document } from 'mongoose'

export interface Company {
  name: string,
  description: string,
  image: string,
  preview: number,
  address: string,
  phone: string,
  status: number
}

export interface CompanyDocument extends Company, Document {}
