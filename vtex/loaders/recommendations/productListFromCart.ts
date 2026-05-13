import type { AppContext } from "../../mod.ts";
import type { ProductListToId } from "../../utils/types.ts";

function makeUnique<T extends unknown>(array: T[]): T[] {
  return [...new Set<T>(array)];
}

/**
 * @title Product IDs from Cart
 * @description Get product IDs from the user's cart
 */
export default async function loader(
  _: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<ProductListToId> {
  const cart = await ctx.invoke.vtex.loaders.cart();
  if (!cart || !cart.items.length) {
    return [];
  }

  return makeUnique(cart.items.map(({ productId }) => productId));
}
