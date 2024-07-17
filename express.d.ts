import { Request } from 'express';
import { TuserDto } from './src/validation/user';

declare module 'express-serve-static-core' {
    interface Request {
      user?: TuserDto;
    }
}