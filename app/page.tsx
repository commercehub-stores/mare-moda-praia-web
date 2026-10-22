import { ProductGrid } from "@/components/product-card.tsx";
import { commerce } from "@/lib/store.ts";

export default async function Home() {
  const { items } = await commerce.catalog.getProducts({ limit: 12 });
  return (
    <>
      <h1>Destaques</h1>
      <ProductGrid products={items} empty="Nenhum produto disponível ainda." />
    </>
  );
}
