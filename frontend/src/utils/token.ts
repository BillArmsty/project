import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    iat?: number;
    email?: string;
    role?: string;
    sub?: string;
  }
  

let accessToken: string = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const isTokenExpired = (): boolean => {
  if (!accessToken) return true;

  try {
    const decoded: JwtPayload = jwtDecode(accessToken);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
};
