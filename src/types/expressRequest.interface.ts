import { Request } from 'express';
import { UserInterface } from './user.interface'

export interface ExpressRequestInterface extends Request {
  user?: UserInterface & { _id: string };
}
