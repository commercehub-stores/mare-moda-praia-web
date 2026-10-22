import { notFound, permanentRedirect } from "next/navigation";
import { collectionByCategoryId } from "@/lib/mare.ts";

interface Props {
  params: Promise<{ id: string }>;
}

/** Old template route (/categoria/{vtexId}) → the Maré collection page. */
export default async function CategoryRedirect({ params }: Props) {
  const collection = collectionByCategoryId((await params).id);
  if (!collection) notFound();
  permanentRedirect(`/c/${collection.slug}`);
}
