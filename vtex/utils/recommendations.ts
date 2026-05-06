import { createBagKey } from "@deco/deco/blocks";
import { getCookies } from "std/http/cookie.ts";
import type { AppContext } from "../mod.ts";

/**
 * @description Get the "x-vtex-rec-origin" header of the recommendation request.
 * @param req - The request object.
 * @param fallback - The fallback "x-vtex-rec-origin" header.
 * @returns The "x-vtex-rec-origin" header of the recommendation request.
 */
export function getOrigin(req: Request, account: string, fallback?: string) {
  const origin = req.headers.get("x-vtex-rec-origin");
  return origin || fallback || `${account}/storefront/deco.recommendations@1.x`;
}

export const VTEX_RECOMMENDATIONS_USER_ID_COOKIE = "vtex-rec-user-id";
export const VTEX_RECOMMENDATIONS_START_SESSION_COOKIE = "vtex-rec-user-id";

export function parseCookie(headers: Headers) {
  const cookies = getCookies(headers);

  const userId = cookies[VTEX_RECOMMENDATIONS_USER_ID_COOKIE] || undefined;
  const sessionStart = cookies[VTEX_RECOMMENDATIONS_START_SESSION_COOKIE] ||
    undefined;

  return { userId, sessionStart };
}

export const RECOMMENDATIONS_USER_ID_KEY = createBagKey(
  "recommendation-user-id",
);

export const getRecommendationsUserIdFromBag = (
  ctx: AppContext,
): string | undefined => ctx?.bag?.get(RECOMMENDATIONS_USER_ID_KEY);
