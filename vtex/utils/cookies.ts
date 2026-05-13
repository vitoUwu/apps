import { getCookies, getSetCookies, setCookie } from "std/http/cookie.ts";

export const stringify = (cookies: Record<string, string>) =>
  Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

export const proxySetCookie = (
  from: Headers,
  to: Headers,
  toDomain?: URL | string,
) => {
  const newDomain = toDomain && new URL(toDomain);

  for (const cookie of getSetCookies(from)) {
    const newCookie = newDomain
      ? {
        ...cookie,
        domain: newDomain.hostname,
      }
      : cookie;

    setCookie(to, newCookie);
  }
};

export function getVtexRCMacIdCookie(req: Request) {
  const cookies = getCookies(req.headers);
  return cookies[VTEX_RC_MAC_ID_V7_COOKIE] as string | undefined;
}

export const VTEX_RC_MAC_ID_V7_COOKIE = "VtexRCMacIdv7";
export const CHECKOUT_DATA_ACCESS_COOKIE = "CheckoutDataAccess";
export const VTEX_CHKO_AUTH = "Vtex_CHKO_Auth";
