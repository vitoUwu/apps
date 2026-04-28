import { type AppContext } from "../mod.ts";

export type Config = Pick<
  AppContext,
  "sp" | "io" | "my" | "vcs" | "vcsDeprecated" | "api" | "vpay" | "sub"
>;

/**
 * @title Get Clients
 * @description Get the clients to use in the storefront
 */
const loader = (_props: unknown, _req: Request, ctx: AppContext): Config => ({
  sp: ctx.sp,
  io: ctx.io,
  my: ctx.my,
  vcs: ctx.vcs,
  api: ctx.api,
  vpay: ctx.vpay,
  sub: ctx.sub,
  vcsDeprecated: ctx.vcsDeprecated,
});

export default loader;

export const cache = "no-cache";
