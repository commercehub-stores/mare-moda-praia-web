"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentCartId, ensureCartId, setBagOpen } from "@/lib/cart.ts";
import { commerce } from "@/lib/store.ts";

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};

/** Adds the chosen size and opens the bag drawer on the same page. */
export async function addToCart(form: FormData) {
  const variantId = text(form, "variantId");
  const quantity = Math.max(1, Math.min(99, Number(text(form, "quantity")) || 1));
  if (!variantId) return;
  const cartId = await ensureCartId();
  await commerce.cart.addItem(cartId, { variantId, quantity });
  await setBagOpen(true);
  revalidatePath("/", "layout");
}

/** "Comprar com Pix em 1 clique": adds the item and goes straight to checkout. */
export async function buyNow(form: FormData) {
  const variantId = text(form, "variantId");
  const quantity = Math.max(1, Math.min(99, Number(text(form, "quantity")) || 1));
  if (!variantId) return;
  const cartId = await ensureCartId();
  await commerce.cart.addItem(cartId, { variantId, quantity });
  redirect(`/checkout/sacola/${cartId}`);
}

export async function updateQuantity(form: FormData) {
  const cartId = await currentCartId();
  const itemId = text(form, "itemId");
  const quantity = Math.max(0, Math.min(99, Number(text(form, "quantity")) || 0));
  if (!cartId || !itemId) return;
  await commerce.cart.updateItem(cartId, itemId, quantity);
  revalidatePath("/", "layout");
}

export async function openBag() {
  await setBagOpen(true);
  revalidatePath("/", "layout");
}

export async function closeBag() {
  await setBagOpen(false);
  revalidatePath("/", "layout");
}

/** Hands the cart to the Checkout layer (Versão Quick, served at /checkout on this same domain). */
export async function goToCheckout() {
  const cartId = await currentCartId();
  if (!cartId) redirect("/carrinho");
  await setBagOpen(false);
  redirect(`/checkout/sacola/${cartId}`);
}

/** Demo newsletter: no list is connected yet, so the address is not stored anywhere. */
export async function subscribe(form: FormData) {
  const email = text(form, "email");
  const back = text(form, "back");
  const path = back.startsWith("/") && !back.startsWith("//") ? back.split(/[?#]/)[0] : "/";
  redirect(email.includes("@") ? `${path}?newsletter=ok#newsletter` : `${path}#newsletter`);
}

/** "Adicionar os 3": every product of a blog post (one size each) in one go. */
export async function addLook(form: FormData) {
  const ids = form
    .getAll("variantId")
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .slice(0, 12);
  if (!ids.length) return;
  const cartId = await ensureCartId();
  for (const variantId of ids) await commerce.cart.addItem(cartId, { variantId, quantity: 1 });
  await setBagOpen(true);
  revalidatePath("/", "layout");
}
