import { ITokenPayload } from "./../types/index";

declare global {
  namespace Express {
    interface Request {
      user: ITokenPayload;
    }
  }
}
