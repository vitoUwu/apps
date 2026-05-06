import { PAGE_DIRTY_KEY } from "@deco/deco/blocks";
import { getCookies } from "std/http/cookie.ts";
import startSession from "./actions/recommendation/startSession.ts";
import { AppMiddlewareContext } from "./mod.ts";
import {
  getISCookiesFromBag,
  setISCookiesBag,
} from "./utils/intelligentSearch.ts";
import {
  parseCookie as parseRecommendationCookies,
  RECOMMENDATIONS_USER_ID_KEY,
} from "./utils/recommendations.ts";
import {
  getSegmentFromBag,
  isCacheableSegment,
  setSegmentBag,
} from "./utils/segment.ts";
import { VTEX_ID_CLIENT_COOKIE } from "./utils/vtexId.ts";

export const middleware = async (
  _props: unknown,
  req: Request,
  ctx: AppMiddlewareContext,
) => {
  const segment = getSegmentFromBag(ctx);
  const isCookies = getISCookiesFromBag(ctx);
  const cookies = getCookies(req.headers);

  if (!isCookies) {
    setISCookiesBag(cookies, ctx);
  }

  if (!segment) {
    setSegmentBag(cookies, req, ctx);
  }

  const isLoggedIn = Boolean(
    cookies[VTEX_ID_CLIENT_COOKIE] ||
      cookies[`${VTEX_ID_CLIENT_COOKIE}_${ctx.account}`],
  );

  const cacheable = isCacheableSegment(ctx) && !isLoggedIn;

  // PAGE_DIRTY_KEY: marks page dirty for section-level caching and other consumers
  if (!cacheable) {
    ctx.bag.set(PAGE_DIRTY_KEY, true);
    ctx.response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
  }

  const { sessionStart } = parseRecommendationCookies(req.headers);
  if (ctx.advancedConfigs?.autoStartRecommendationSession && !sessionStart) {
    try {
      const response = await startSession({}, req, ctx);
      ctx.bag.set(RECOMMENDATIONS_USER_ID_KEY, response.recommendationsUserId);
    } catch (_) {
      //
    }
  }

  return ctx.next!();
};
