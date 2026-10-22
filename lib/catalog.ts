import type { Product } from "./commerce/index.ts";
import { type Collection, DEPARTMENT_ID, discountPercent, leadVariant } from "./mare.ts";
import { commerce } from "./store.ts";

/** Every Maré product (the department has < 100; VTEX pages hold 50). */
export async function departmentProducts(sort: "relevance" | "newest" = "relevance"): Promise<Product[]> {
  const page = (cursor: string) => commerce.search.search({ term: "", filters: { category: [DEPARTMENT_ID] }, sort, limit: 50, cursor });
  const first = await page("0");
  if (!first.nextCursor) return first.items;
  const second = await page(first.nextCursor);
  return [...first.items, ...second.items];
}

export async function collectionProducts(collection: Collection): Promise<Product[]> {
  if (collection.slug === "novidades") return (await departmentProducts("newest")).slice(0, 24);
  if (collection.slug === "sale") return (await departmentProducts()).filter((p) => discountPercent(leadVariant(p)) > 0);
  if (!collection.categoryId) return [];
  // VTEX matches the full tree path (C:/19/20/), so a subcategory filter carries its department.
  const { items } = await commerce.search.search({ term: "", filters: { category: [`${DEPARTMENT_ID}/${collection.categoryId}`] }, limit: 50 });
  return items;
}

export const withImages = (products: Product[]) => products.filter((p) => p.images.length > 0);
