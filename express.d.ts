import { Request } from 'express';
import { TuserDto } from './src/dto/user';

declare module 'express-serve-static-core' {
    interface Request {
      user?: TuserDto;
    }
}