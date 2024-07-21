import { addDays, addHours } from 'date-fns';

function encodeJWT(payload: Record<string, string>, secret: string, exp: Date) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify({ ...payload, iat: new Date().toUTCString(), exp })).replace(/=+$/, '');

  const signature = btoa(secret).replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const createJWT = (userData: Record<string, string>, expiresIn: Date) => encodeJWT(userData, 'JWT_SECRET', expiresIn);

export const createAccessToken = (userData: Record<string, string>) => createJWT(userData, addHours(new Date(), 1));
export const createRefreshToken = (userData: Record<string, string>) => createJWT(userData, addDays(new Date(), 14));
