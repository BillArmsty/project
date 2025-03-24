interface JwtPayload {
  role?: string;
  email?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

export function getRoleFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];

    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log("Decoded JWT Payload:", decodedPayload);

    return decodedPayload?.role || null;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return null;
  }
}
