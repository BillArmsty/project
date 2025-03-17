import { RequestContext } from 'express-openid-connect';

declare module 'express' {
  export interface Request {
    user?: {
      oidc?: RequestContext
    };
  }
}
