import { TableEnum } from '../enums/table.enum'
import { Types } from 'mongoose'

export interface TableInterface {
  name: string;
  seat_count: number;
  type: TableEnum;
  status: number;
  company_id: Types.ObjectId;
}

export interface TableDocument extends TableInterface, Document {

}
