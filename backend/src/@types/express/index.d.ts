declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    authSession: {
      id: string;
    };
  }
}
