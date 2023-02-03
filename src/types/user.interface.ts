import { Document, Types } from 'mongoose'
import { Role } from '../enums/role.enum'

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  image: string;
  company_id: Types.ObjectId;
  status: number;
}

export interface UserDocument extends UserInterface, Document {
  validatePassword(param: string): Promise<boolean>;
}
