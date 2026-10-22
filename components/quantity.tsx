"use client";

import { useState } from "react";

/** Quantity stepper posted with the add-to-bag form (field "quantity"). */
export function Quantity() {
  const [qty, setQty] = useState(1);
  return (
    <div className="qty">
      <button type="button" aria-label="Diminuir quantidade" onClick={() => setQty((q) => Math.max(1, q - 1))}>
        <img src="/icons/minus.svg" alt="" width={16} height={16} />
      </button>
      <input name="quantity" type="number" min={1} max={99} value={qty} aria-label="Quantidade" onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} />
      <button type="button" aria-label="Aumentar quantidade" onClick={() => setQty((q) => Math.min(99, q + 1))}>
        <img src="/icons/plus.svg" alt="" width={16} height={16} />
      </button>
    </div>
  );
}
